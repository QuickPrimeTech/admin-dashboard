"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Plus, Edit, Trash2, Search, Upload, Eye, EyeOff } from "lucide-react"
import { GalleryDialog } from "@/components/admin/gallery-dialog"
import { toast } from "sonner"
import { mockAPI } from "@/lib/mock-api"
import Image from "next/image"

interface GalleryItem {
  id: string
  title?: string
  description?: string
  image_url: string
  order_index: number
  is_published: boolean
  created_at: string
}

export default function GalleryPage() {
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([])
  const [filteredItems, setFilteredItems] = useState<GalleryItem[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showPublished, setShowPublished] = useState("all")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)

  const publishOptions = ["all", "published", "draft"]

  useEffect(() => {
    fetchGalleryItems()
  }, [])

  useEffect(() => {
    filterItems()
  }, [galleryItems, searchTerm, showPublished])

  const fetchGalleryItems = async () => {
    try {
      const data = await mockAPI.getGalleryItems()
      setGalleryItems(data)
    } catch (error) {
      toast.error("Failed to fetch gallery items")
    } finally {
      setLoading(false)
    }
  }

  const filterItems = () => {
    let filtered = galleryItems

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (showPublished !== "all") {
      const isPublished = showPublished === "published"
      filtered = filtered.filter((item) => item.is_published === isPublished)
    }

    setFilteredItems(filtered)
  }

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteGalleryItem(id)
      setGalleryItems((prev) => prev.filter((item) => item.id !== id))
      toast.success("Gallery item deleted successfully")
    } catch (error) {
      toast.error("Failed to delete gallery item")
    }
  }

  const handleEdit = (item: GalleryItem) => {
    setEditingItem(item)
    setIsDialogOpen(true)
  }

  const handleDialogClose = () => {
    setIsDialogOpen(false)
    setEditingItem(null)
  }

  const handleItemSaved = () => {
    fetchGalleryItems()
    handleDialogClose()
  }

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      await mockAPI.updateGalleryItem(id, { is_published: !isPublished })
      setGalleryItems((prev) => prev.map((item) => (item.id === id ? { ...item, is_published: !isPublished } : item)))
      toast.success(`Gallery item ${!isPublished ? "published" : "unpublished"} successfully`)
    } catch (error) {
      toast.error("Failed to update gallery item status")
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Gallery Management</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-square bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Gallery Management</h1>
          <p className="text-muted-foreground">Manage your restaurant's photo gallery</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Photo
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search gallery items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {publishOptions.map((option) => (
            <Button
              key={option}
              variant={showPublished === option ? "default" : "outline"}
              size="sm"
              onClick={() => setShowPublished(option)}
              className="capitalize"
            >
              {option}
            </Button>
          ))}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No gallery items found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || showPublished !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first photo"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Photo
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-square">
                <Image
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.title || "Gallery image"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                <div className="absolute top-2 right-2 flex gap-1">
                  <Badge variant={item.is_published ? "default" : "secondary"}>
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button size="sm" variant="secondary" onClick={() => togglePublished(item.id, item.is_published)}>
                    {item.is_published ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button size="sm" variant="secondary" onClick={() => handleEdit(item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleDelete(item.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {(item.title || item.description) && (
                <CardContent className="p-4">
                  {item.title && <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>}
                  {item.description && (
                    <CardDescription className="text-xs mt-1 line-clamp-2">{item.description}</CardDescription>
                  )}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      <GalleryDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  )
}
