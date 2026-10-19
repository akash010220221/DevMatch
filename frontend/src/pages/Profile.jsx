import React from 'react'
import EditProfile from '@/components/EditProfile'
import { useSelector } from 'react-redux'
import useDocumentTitle from '@/hooks/useDocumentTitle';
import { UserIcon } from '@/utils/Icons';

const Profile = () => {
    const user = useSelector((store) => store.user);
    useDocumentTitle(user ? `Settings: ${user.firstName}` : "Account Settings");

    if (!user) return null;

    return (
        <div className="min-h-screen bg-base-100 py-10">
            <EditProfile user={user} />
        </div>
    );
}

export default Profile