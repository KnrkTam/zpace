import { User } from "@/types/User";
import { req } from "./https";

export async function createUser(params: any) {
  return await req("post", "/api/auth/sign-up", params);
}

export async function updateProfileImg(id: string, params: any) {
  return await req("post", `/api/profile/${id}/`, params);
}

export async function updateUserInfo(params: any) {
  return await req("post", `/api/user/update`, params);
}

export async function updateUserSession(params: any) {
  return await req("post", `/api/user/update-session`, params);
}
