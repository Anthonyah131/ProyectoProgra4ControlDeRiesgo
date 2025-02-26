"use client";
import InformationTable from "./informationTable";
import Header from "@/components/header/header";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useUser } from "../../../lib/userContext";
import { User } from "../../index";
import MantFormSkeleton from "../../skeleton/mantFormSkeleton";
import ScrollToTopButton from "../../util/buttonToTop";

const Information: React.FC = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [inactiveUsers, setInactiveUsers] = useState<User[]>([]);
  const [showInactive, setShowInactive] = useState(false);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && !session) {
      router.push("/");
    } else if (user) {
      fetchUsers();
    }
  }, [session, user, router]);

  const fetchUsers = async () => {
    if (!user?.department_dep_id) return;
    try {
      const response = await fetch(
        `/api/adminBossArea?departmentId=${user.department_dep_id}`
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log("Fetched users:", data);
      const active = data.filter((u: User) => u.usu_state === "A");
      const inactive = data.filter((u: User) => u.usu_state === "I");
      setActiveUsers(active);
      setInactiveUsers(inactive);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching users:", error);
    }
  };

  const handleStateChange = async (
    checked: boolean,
    user: User,
    field: "usu_state" | "usu_torespond"
  ) => {
    const newState = checked ? "A" : "I";
    const newToRespond = checked ? "y" : "n";

    try {
      const response = await fetch("/api/adminBossArea", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.usu_id,
          state: field === "usu_state" ? newState : user.usu_state,
          toRespond:
            field === "usu_torespond" ? newToRespond : user.usu_torespond,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Update the user state locally
      if (field === "usu_state") {
        if (newState === "A") {
          setInactiveUsers((prev) =>
            prev.filter((u) => u.usu_id !== user.usu_id)
          );
          setActiveUsers((prev) => [...prev, { ...user, usu_state: newState }]);
        } else {
          setActiveUsers((prev) =>
            prev.filter((u) => u.usu_id !== user.usu_id)
          );
          setInactiveUsers((prev) => [
            ...prev,
            { ...user, usu_state: newState },
          ]);
        }
      } else {
        setActiveUsers((prev) =>
          prev.map((u) =>
            u.usu_id === user.usu_id ? { ...u, usu_torespond: newToRespond } : u
          )
        );
        setInactiveUsers((prev) =>
          prev.map((u) =>
            u.usu_id === user.usu_id ? { ...u, usu_torespond: newToRespond } : u
          )
        );
      }
    } catch (error) {
      console.error("Error updating user state:", error);
    }
  };

  if (loading) {
    return (
      <div>
        <Header />
        <div className="p-14">
          <MantFormSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="background_color">
      <Header />
      <section className="p-14 flex flex-col items-center">
        <h1 className="text-3xl font-bold m-4 text-white">
          Coordinadores Internos
        </h1>
        <h2 className="text-2xl font-bold text-white mt-8">
          Mostrar coordinadores por estado:
        </h2>
        <button
          className="flex p-2 border rounded-xl text-white w-52 h-12 font-bold justify-center items-center btn-form hover:bg-slate-600 mt-6"
          onClick={() => setShowInactive(!showInactive)}
        >
          {showInactive ? "Mostrar Activos" : "Mostrar Inactivos"}
        </button>

        <div className="w-full">
          <InformationTable
            users={showInactive ? inactiveUsers : activeUsers}
            setUsers={showInactive ? setInactiveUsers : setActiveUsers}
            handleStateChange={handleStateChange}
          />
        </div>
      </section>
      <ScrollToTopButton />
    </div>
  );
};

export default Information;
