import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postLogin, postLoginInputSchema, PostLoginInput } from '@/api';
import { isInvalidCredentialsError } from '@/errors';

import styles from './LoginForm.scss';

const defaultValues: PostLoginInput = {
  email: '',
  password: '',
};

export const LoginForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues,
    resolver: zodResolver(postLoginInputSchema),
  });
  const [postError, setPostError] = React.useState<string | null>(null);

  return (
    <form
      className={styles.module}
      onSubmit={handleSubmit(async (values) => {
        try {
          const data = await postLogin(values);
          window.location.assign(data.redirectUrl);
        } catch (err) {
          if (isInvalidCredentialsError(err)) {
            setPostError('メールアドレスまたはパスワードが間違っています');
          } else {
            setPostError(`サーバーが大変込み合っています。
            大変お手数ですがしばらく時間をおいてから再度お試しください。`);
          }
        }
      })}
    >
      <div className={styles.inputs}>
        {postError && <p>{postError}</p>}
        <fieldset className={styles.fieldset}>
          <legend className={styles.legend}>ログイン</legend>
          <div className={styles.email}>
            <label htmlFor="email">メールアドレス</label>
            <TextboxWithError
              {...register('email')}
              id="email"
              type="text"
              placeholder="example@test.com"
              error={errors.email?.message}
            />
          </div>
          <div className={styles.password}>
            <label htmlFor="password">パスワード</label>
            <TextboxWithError
              {...register('password')}
              id="password"
              type="password"
              placeholder="8文字以上で入力"
              error={errors.password?.message}
            />
          </div>
        </fieldset>
        <button className={styles.button}>ログイン</button>
      </div>
    </form>
  );
};

/*--------------------
 * Helper components
 *  If you write production code,
 *  these componets should not be in the same file,
 *  but for the sake of simplicity, I put it here.
 *--------------------*/

type TextboxWithErrorProps = {
  id: string;
  type: string;
  placeholder: string;
  error: string | undefined;
} & React.InputHTMLAttributes<HTMLInputElement>;

const TextboxWithError = React.forwardRef<HTMLInputElement, TextboxWithErrorProps>(
  ({ id, type, placeholder, error, ...rest }, ref) => (
    <div className={styles.textboxWithError}>
      <input {...rest} ref={ref} id={id} type={type} placeholder={placeholder} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  ),
);
