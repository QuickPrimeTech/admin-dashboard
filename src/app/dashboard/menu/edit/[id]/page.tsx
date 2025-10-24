"use client";

import { useParams } from "next/navigation";

// type UpdateMenuPageParams =

export default function UpdateMenuPate() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);

  return (
    <div>
      Welcome to the update page. You are about to edit {numericId} and the
      string form {typeof id}
    </div>
  );
}
