"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Video,
  ImageIcon,
  Eye,
  EyeOff,
} from "lucide-react";
import { SocialMediaDialog } from "@/components/dashboard/social-media-dialog";
import { toast } from "sonner";
import { mockAPI } from "@/lib/mock-api";
import Image from "next/image";

interface SocialMediaItem {
  id: string;
  platform: string;
  content_type: string;
  title?: string;
  url: string;
  thumbnail_url?: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
}

export default function FollowUsPage() {
  const [socialItems, setSocialItems] = useState<SocialMediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<SocialMediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [platformFilter, setPlatformFilter] = useState("all");
  const [contentTypeFilter, setContentTypeFilter] = useState("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<SocialMediaItem | null>(null);
  const [loading, setLoading] = useState(true);

  const platforms = [
    "all",
    "instagram",
    "tiktok",
    "youtube",
    "facebook",
    "twitter",
  ];
  const contentTypes = ["all", "video", "image", "post"];

  useEffect(() => {
    fetchSocialItems();
  }, []);

  const fetchSocialItems = async () => {
    try {
      const data = await mockAPI.getSocialMediaItems();
      setSocialItems(data);
    } catch {
      toast.error("Failed to fetch social media items");
    } finally {
      setLoading(false);
    }
  };

  const filterItems = useCallback(() => {
    let filtered = socialItems;

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.platform.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (platformFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.platform.toLowerCase() === platformFilter
      );
    }

    if (contentTypeFilter !== "all") {
      filtered = filtered.filter(
        (item) => item.content_type.toLowerCase() === contentTypeFilter
      );
    }

    setFilteredItems(filtered);
  }, [socialItems, searchTerm, platformFilter, contentTypeFilter]);

  useEffect(() => {
    filterItems();
  }, [filterItems]);

  const handleDelete = async (id: string) => {
    try {
      await mockAPI.deleteSocialMediaItem(id);
      setSocialItems((prev) => prev.filter((item) => item.id !== id));
      toast.success("Social media item deleted successfully");
    } catch {
      toast.error("Failed to delete social media item");
    }
  };

  const handleEdit = (item: SocialMediaItem) => {
    setEditingItem(item);
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setEditingItem(null);
  };

  const handleItemSaved = () => {
    fetchSocialItems();
    handleDialogClose();
  };

  const togglePublished = async (id: string, isPublished: boolean) => {
    try {
      await mockAPI.updateSocialMediaItem(id, { is_published: !isPublished });
      setSocialItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, is_published: !isPublished } : item
        )
      );
      toast.success(
        `Social media item ${
          !isPublished ? "published" : "unpublished"
        } successfully`
      );
    } catch {
      toast.error("Failed to update social media item status");
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return "bg-pink-100 text-pink-800";
      case "tiktok":
        return "bg-black text-white";
      case "youtube":
        return "bg-red-100 text-red-800";
      case "facebook":
        return "bg-blue-100 text-blue-800";
      case "twitter":
        return "bg-sky-100 text-sky-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Follow Us</h1>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <div className="aspect-video bg-muted rounded-t-lg"></div>
              <CardContent className="p-4">
                <div className="h-4 bg-muted rounded mb-2"></div>
                <div className="h-3 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Follow Us</h1>
          <p className="text-muted-foreground">
            Manage your social media content and links
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Content
        </Button>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search social media content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2">
            {platforms.map((platform) => (
              <Button
                key={platform}
                variant={platformFilter === platform ? "default" : "outline"}
                size="sm"
                onClick={() => setPlatformFilter(platform)}
                className="capitalize"
              >
                {platform}
              </Button>
            ))}
          </div>
          <div className="flex gap-2">
            {contentTypes.map((type) => (
              <Button
                key={type}
                variant={contentTypeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setContentTypeFilter(type)}
                className="capitalize"
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="text-center">
              <Video className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No social media content found
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ||
                platformFilter !== "all" ||
                contentTypeFilter !== "all"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first social media content"}
              </p>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Content
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredItems.map((item) => (
            <Card key={item.id} className="overflow-hidden group">
              <div className="relative aspect-video bg-muted">
                {item.thumbnail_url ? (
                  <Image
                    src={item.thumbnail_url || "/placeholder.svg"}
                    alt={item.title || "Social media content"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    {item.content_type === "video" ? (
                      <Video className="h-12 w-12 text-muted-foreground" />
                    ) : (
                      <ImageIcon className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>
                )}
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge
                    className={getPlatformColor(item.platform)}
                    variant="secondary"
                  >
                    {item.platform}
                  </Badge>
                  <Badge variant="outline">{item.content_type}</Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant={item.is_published ? "default" : "secondary"}>
                    {item.is_published ? "Published" : "Draft"}
                  </Badge>
                </div>
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => togglePublished(item.id, item.is_published)}
                  >
                    {item.is_published ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleEdit(item)}
                  >
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
              <CardContent className="p-4">
                <CardTitle className="text-sm font-medium truncate">
                  {item.title || `${item.platform} ${item.content_type}`}
                </CardTitle>
                <CardDescription className="text-xs mt-1 truncate">
                  {item.url}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <SocialMediaDialog
        open={isDialogOpen}
        onOpenChange={handleDialogClose}
        item={editingItem}
        onSaved={handleItemSaved}
      />
    </div>
  );
}
