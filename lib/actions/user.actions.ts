'use server'

import { clerkClient, currentUser } from "@clerk/nextjs/server"
import { parseStringify } from "../utils";
import { liveblocks } from "../liveblocks";

export const getClerkUsers = async ({ userIds }: { userIds: string[] }) => {
    const clerk = await clerkClient();
    try{
        const { data } = await clerk.users.getUserList({
            emailAddress: userIds,
        });

        const users = data.map((user) => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            email: user.emailAddresses[0].emailAddress,
            avatar: user.imageUrl,
        }));

        const sortedUsers = userIds.map((email) => users.find((user) => user.email == email))
        return parseStringify(sortedUsers);
    } catch (err) {
        console.log('Error fetching users. ', err)
    }
}

export const getDocumentUsers = async ({ roomId, currentUser, text }: { roomId: string, currentUser: string, text:string }) => {
    try {
        const room = await liveblocks.getRoom(roomId);
        const users = Object.keys(room.usersAccesses).filter((email) => email !== currentUser);

        if (text.length){
            const lowerCasetText = text.toLowerCase();

            const filteredUsers = users.filter((email: string) => email.toLowerCase().includes(lowerCasetText));

            return parseStringify(filteredUsers);
        }
    } catch (err) {
        console.error("Error fetching document users: ", err);
    }
}