'use client'

import { useCallback, useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { type User } from '@supabase/supabase-js'
import Avatar from './avatar'

export default function AccountForm({ user }: { user: User | null }) {

    const supabase = createClient();
    
    const [loading, setLoading] = useState(true)
    const [avatar_url, setAvatarUrl] = useState<string | null>(null)

    const getProfile = useCallback(async () => {
        try {
            setLoading(true)

            const { data, error, status } = await supabase
                .from('restaurants')
                .select(`avatar_url`)
                .single()

            if (error && status !== 406) {
                console.log(error)
                throw error
            }

            if (data) {
                setAvatarUrl(data.avatar_url)
            }
        } catch (error) {
            alert('Error loading user data!')
        } finally {
            setLoading(false)
        }
    }, [user, supabase])

    useEffect(() => {
        getProfile()
    }, [user, getProfile])

    async function updateProfile({
        avatar_url,
    }: {
        avatar_url: string | null
    }) {
        try {
            setLoading(true)

            const { error } = await supabase.from('restaurants').upsert({
                avatar_url,
            })
            if (error) throw error
            alert('Profile updated!')
        } catch (error) {
            alert('Error updating the data!')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="form-widget">
            <Avatar
                uid={user?.id ?? null}
                url={avatar_url}
                size={80}
                onUpload={(url) => {
                    setAvatarUrl(url)
                    updateProfile({avatar_url: url })
                }}
            />
        </div>
    )
}