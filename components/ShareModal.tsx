'use client'

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import Image from 'next/image';

import { useSelf } from '@liveblocks/react/suspense';
import React, { useState } from 'react'
import { Label } from "./ui/label";
import UserTypeSelector from "./UserTypeSelector";
import Collaborator from "./Collaborator";
import { updateDocumentAccess } from "@/lib/actions/room.actions";

const ShareModal = ( {roomId, collaborators, creatorId, currentUserType}: ShareDocumentDialogProps ) => {
    const user = useSelf();
    
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [userType, setUserType] = useState<UserType>('viewer');

    const shareDocumentHandler = async () => {
        setLoading(true);

        await updateDocumentAccess({
            roomId,
            email,
            userType: userType as UserType,
            updatedBy: user.info,
        })
    }

    return (
    <div>
          <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogTrigger asChild>
          <Button className="gradient-blue flex h-9 gap-1 px-4" disabled={currentUserType !== 'editor'} variant="outline">
            <Image src='/assets/icons/share.svg' alt="share" width={20} height={20} className="min-w-4 md:size-5" />
            <p className="mr-1 hidden sm:block">Share</p>
          </Button>
        </DialogTrigger>
        <DialogContent className="shad-dialog">
          <DialogHeader>
            <DialogTitle>Manage who can view this project</DialogTitle>
            <DialogDescription>
              Select which users can view and edit this document.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="email" className="mt-6 text-blue-100">Email address</Label>
              <div className="flex flex-1 rounded-md bg-dark-400">
                <Input id="email" placeholder="Enter email address" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="share-input"/>
                <UserTypeSelector userType={userType} setUserType={setUserType} />
              </div>
            </div>
            <Button type="submit" onClick={shareDocumentHandler} className="gradient-blue flex h-full gap-1 px-5" disabled={loading}> {loading ? 'Sending...' : 'Invite'} </Button>
          </div>
          <div className="my-2 space-y-2">
            <ul className="flex flex-col">
                {collaborators.map((col) => (
                    <Collaborator key={col.id} roomId={roomId} creatorId={creatorId} email={col.email} collaborator={col} user={user.info} />
                ))}
            </ul>
          </div>
        </DialogContent>
      </form>
    </Dialog>
    </div>
  )
}

export default ShareModal