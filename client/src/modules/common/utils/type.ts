import { User } from "~/entities/user";

export const typeLabel: Record<User["type"], string> = {
  child: "어린이",
  guardian: "보호자",
};
