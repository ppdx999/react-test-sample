import * as zod from "zod";
import { InvalidCredentialsError  } from "@/errors";

export const postLoginInputSchema = zod.object({
  email: zod.string().email("不正なメールアドレスです"),
  password: zod.string().min(8, "パスワードは8文字以上です"),
});

export type PostLoginInput = zod.infer<typeof postLoginInputSchema>;

export const postLogin = async (input: PostLoginInput) => {
  // 本来はAPIを叩くなどの処理を行う
  // ここでは簡略化のためハードコードしている
  if (input.email === "500@example.com") {
    throw new Error("Internal Server Error");
  }

  if (input.email !== "user@example.com") {
    throw new InvalidCredentialsError();
  }

  if (input.password !== "password") {
    throw new InvalidCredentialsError();
  }

  return { redirectUrl: "/mypage" };
}

