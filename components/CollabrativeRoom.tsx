'use client'

import React, { ReactNode, useEffect, useRef, useState } from 'react'
import {RoomProvider, ClientSideSuspense} from '@liveblocks/react/suspense'
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Editor } from '@/components/editor/Editor';
import Header from '@/components/Header';
import ActiveCollaborators from './ActiveCollaborators';
import { Input } from './ui/input';
import Image from 'next/image'
import { updateDocument } from '@/lib/actions/room.actions';
import Loader from './Loader';
import ShareModal from './ShareModal';

const CollabrativeRoom = ( {roomId, roomMetadata, users, currentUserType}: CollaborativeRoomProps ) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(roomMetadata.title);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const resolvedRoomId = roomId?.trim() || '';

  const updateInputHandler = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if(e.key === 'Enter'){
      setLoading(true);
      try{
        if (documentTitle !== roomMetadata.title) {
          const updatedDocument = await updateDocument(roomId, documentTitle)

          if (updatedDocument) {setEditing(false)};
        }
      } catch(err){
        console.log(err);
      }
      setLoading(false);
    }
  }

  useEffect(() => {
    const handleClickOutside = (e:MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setEditing(false);
        updateDocument(roomId, documentTitle);
      }}

      document.addEventListener('mousedown', handleClickOutside);

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      }
  }, [roomId, documentTitle]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
    }
  },[editing])

  if (!resolvedRoomId) {
    return <div className='collabrative-room'>Unable to load this document.</div>;
  }

  return (
        <RoomProvider id={resolvedRoomId} key={resolvedRoomId}>
        
        <ClientSideSuspense fallback={<Loader />}>
          <div className='collabrative-room'>
            <Header>
                <div ref={containerRef} className='flex w-fit items-center justify-center gap-2'>
                   {editing && !loading ? (
                    <Input type='text' value={documentTitle} ref={inputRef} placeholder='Enter title' onChange={(e) => setDocumentTitle(e.target.value)} onKeyDown={updateInputHandler} disabled={!editing} className='document-title-input' />
                   ) : <>
                   <p className='document-title'> {documentTitle} </p>
                   </> }
                   {currentUserType === 'editor' && !editing && 
                   (<Image src='/assets/icons/edit.svg' 
                   alt='Edit' 
                   width={24} 
                   height={24} 
                   onClick={() => setEditing(true)} className='pointer' />
                   )}

                    {currentUserType !== 'editor' && !editing && 
                   (<p className='view-only-tag'>View only</p>)}

                   {loading && <p className='text-sm text-gray-400'>saving...</p>}
                </div>
                <div className='flex w-full flex-1 justify-end gap-2'>
                  <ActiveCollaborators />
                  <ShareModal roomId={roomId} collaborators={users} creatorId={roomMetadata.creatorId} currentUserType={currentUserType} />
                </div>
                <SignedOut>
                    <SignInButton />
                    <SignUpButton>
                        <button className="bg-[#6c47ff] text-ceramic-white rounded-full font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 cursor-pointer">
                        Sign Up
                        </button>
                    </SignUpButton>
                    </SignedOut>
                    <SignedIn>
                    <UserButton />
                    </SignedIn>
                </Header>
                <Editor roomId={roomId} currentUserType={currentUserType} />
          </div>
        </ClientSideSuspense>
      </RoomProvider>
  )
}

export default CollabrativeRoom
