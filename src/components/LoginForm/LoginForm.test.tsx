import React from "react";
import { PostLoginInput } from '@/api';
import * as api from "@/api";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./LoginForm";

export async function setup(injectValues?: Partial<PostLoginInput>) {
  const input = {
    email: "user@example.com",
    password: "password",
    ...injectValues,
  };

  render(<LoginForm />);

  const emailInput = screen.getByLabelText("メールアドレス");
  const passwordInput = screen.getByLabelText("パスワード");
  const submitButton = screen.getByRole("button", { name: "ログイン" });

  await userEvent.type(emailInput, input.email);
  await userEvent.type(passwordInput, input.password);
  await userEvent.click(submitButton);
}

describe("LoginForm", () => {
  test("ログインに成功すると/mypageにリダイレクトする", async () => {
    await setup();
    await waitFor(() => expect(window.location.pathname).toBe("/mypage"));
  });

  test("不正なメールアドレスを入力すると画面に「不正なメールアドレスです」と表示される", async () => {
    await setup({ email: "invalid" });
    await waitFor(() =>
      expect(screen.getByText("不正なメールアドレスです")).toBeInTheDocument()
    );
  });

  test("不正なパスワードを入力すると画面に「パスワードは8文字以上です」と表示される", async () => {
    await setup({ password: "short" });
    await waitFor(() =>
      expect(screen.getByText("パスワードは8文字以上です")).toBeInTheDocument()
    );
  });

  test("間違った認証情報を入力すると画面に「メールアドレスまたはパスワードが間違っています」と表示される", async () => {
    await setup({ password: "validButWrongPassword" });
    await waitFor(() =>
      expect(
        screen.getByText("メールアドレスまたはパスワードが間違っています")
      ).toBeInTheDocument()
    );
  });

  test("APIがエラーを返すと画面に「サーバーが大変込み合っています。大変お手数ですがしばらく時間をおいてから再度お試しください。」と表示される", async () => {
    // APIがエラーを返すようにモックする
    jest.spyOn(api, "postLogin").mockRejectedValueOnce(new Error("error"));

    const textRegex = /サーバーが大変込み合っています/;

    await setup();
    await waitFor(() =>
      expect(
        screen.getByText(
          (content, element) => textRegex.test(content ?? "") && element?.tagName === "P"
        )
      ).toBeInTheDocument()
    );
  });
});
