import { SingleUserResponseType } from "@/types/usersTypes";
import { axiosFunction } from "@/utils/axiosFunction";

interface fetchUserListProps {
  startDate: string;
  endDate: string;
}

interface fetchApiUserListProps {
  startDate: string;
  endDate: string;
}

// ======== USER ========
export const fetchUserList = async <T>({
  startDate,
  endDate,
}: fetchUserListProps): Promise<T | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/users",
      data: payload,
    });

    return response;
  } catch (err) {
    console.error("Error fetching users list:", err);
    return null;
  }
};

export const fetchAllUserList = async () => {
  try {
    const response = await axiosFunction({
      method: "POST",
      urlPath: "/users",
    });

    return response;
  } catch (err) {
    console.error("Error fetching users list:", err);
    return null;
  }
};
// ======== USER ========

// ======== API USER ========
export const fetchAllApiUserList = async () => {
  try {
    const response = axiosFunction({
      method: "POST",
      urlPath: "/api-users",
    });
    return response;
  } catch (err) {
    console.error("Error fetching api users list:", err);
    return null;
  }
};

export const fetchApiUserList = async <T>({
  startDate,
  endDate,
}: fetchApiUserListProps): Promise<T | null> => {
  const payload = { date: `${startDate} to ${endDate}` };

  try {
    const response = axiosFunction({
      method: "POST",
      urlPath: "/api-users",
      data: payload,
    });
    return response;
  } catch (err) {
    console.error("Error fetching api users list:", err);
    return null;
  }
};
// ======== API USER ========

export const fetchUserProfile = () => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: "/users/my-profile",
    });

    return response;
  } catch (err) {
    console.error("Error fetching api users list:", err);
    return null;
  }
};

export const fetchSingleUser = async (
  userId: number | null
): Promise<SingleUserResponseType | null> => {
  try {
    const response = axiosFunction({
      method: "GET",
      urlPath: `/users/${userId}`,
    });
    return response;
  } catch (err) {
    console.error("Error fetching single user", err);
    return null;
  }
};
