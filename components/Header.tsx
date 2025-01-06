"use client";

import { IoPersonCircleOutline } from "react-icons/io5";
import Logo from "./ui/Logo";
import { useState } from "react";
import { useSession } from "next-auth/react";
import ProfileMenu from "./by-page/user/ProfileMenu";
import Modal from "./ui/Modal";
import MyWeight from "./by-page/user/MyWeight";
import { useWeight } from "@/app/data/user/useWeight";
import MyFoods from "./by-page/user/MyFoods";
import CreateEditFood from "./by-page/food/CreateEditFood";

export default function Header() {
  const [profileMenu, setProfileMenu] = useState(false);
  const user = useSession();
  const username = user.data?.user?.name || "Usuário";
  const userId = user.data?.userId;
  const handler = () => setProfileMenu(false);
  const { data: weight } = useWeight();

  return (
    <>
      <header className="">
        <div className="mx-auto max-w-screen-lg bg-white fixed h-14 w-full border-b-2 border-lightgreen flex  items-center justify-center z-50 ">
          <div className="w-32 m-auto">
            <Logo />
          </div>
          <button
            id="profile-menu"
            className="absolute right-2 cursor-pointer top-50% text-2xl text-grey40"
            onClick={() => setProfileMenu(true)}
          >
            <IoPersonCircleOutline className="w-7 h-7 " />
          </button>
          {profileMenu && <ProfileMenu username={username} handler={handler} />}
        </div>
      </header>
      <Modal.Window name="my-weight">
        <MyWeight userId={userId} userWeight={weight || 0} />
      </Modal.Window>
      <Modal.Window name="my-foods">
        <MyFoods />
      </Modal.Window>
      <Modal.Window name="create-food">
        <CreateEditFood modalName="create-food" />
      </Modal.Window>
      <Modal.Window name="create-food-return">
        <CreateEditFood shouldReturn={true} modalName="create-food-return" />
      </Modal.Window>
    </>
  );
}
