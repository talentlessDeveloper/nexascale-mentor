import { type User } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type UserCardInfoProps = {
  userData: User;
};

const UserCardInfo = ({ userData }: UserCardInfoProps) => {
  return (
    <div className="flex items-center gap-2 py-3">
      <Link href={`/profile/${userData?.username}`}>
        <Image
          width={48}
          height={48}
          src={userData.image!}
          alt={"Ope"}
          className="h-12 w-12 rounded-full"
        />
      </Link>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-[2px]">
          <Link
            href={`/profile/${userData?.username}`}
            className="text-sm font-bold hover:underline"
          >
            {userData?.name}
          </Link>
          <span className="font-bold">.</span>
          <span className="text-bold">{userData?.points}</span>
        </div>
        <span>@{userData?.username}</span>
      </div>
    </div>
  );
};

export default UserCardInfo;
