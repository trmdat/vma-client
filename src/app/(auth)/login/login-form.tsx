"use client";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Button, Input } from "@nextui-org/react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useToast } from "@oursrc/hooks/use-toast";
import { ROLE, decodeToken } from "@oursrc/lib/utils";
import { authService } from "@oursrc/lib/services/authService";

const LoginForm = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isVisible, setIsVisible] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (data: any) => {
    try {
      setIsLoading(true);
      const res = await authService.login(data.username, data.password);
      console.log(res);
      await authService.setTokenToCookie(res.data?.accessToken, res.data?.refreshToken);
      if (res.isSuccess === true) {
        localStorage.setItem("accessToken", res.data?.accessToken);
        const role = decodeToken(res.data?.accessToken)?.role?.toLowerCase();
        if (role === ROLE.VETERINARIAN) {
          router.push("/veterinarian/dashboard");
        } else {
          router.push("/farmer/dashboard");
        }
        toast({
          variant: "success",
          title: "Đăng nhập thành công",
        });
      } else {
        toast({
          variant: "destructive",
          title: res.errorMessage || "Đăng nhập thất bại",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleLogin)}>
      <Input
        className="w-80 mb-5"
        type="text"
        label="Tên đăng nhập"
        isRequired
        isInvalid={errors.username ? true : false}
        errorMessage="Tên đăng nhập không được để trống"
        {...register("username", { required: true })}
      />
      <Input
        className="w-80 mt-5"
        label="Mật khẩu"
        isRequired
        type={isVisible ? "text" : "password"}
        endContent={
          <Button isIconOnly variant="light" onClick={toggleVisibility}>
            {isVisible ? <FaEye className="text-2xl text-default-400 pointer-events-none" /> : <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />}
          </Button>
        }
        isInvalid={errors.password ? true : false}
        errorMessage="Mật khẩu không được để trống"
        {...register("password", { required: true })}
      />
      <Button className="bg-gradient-to-r from-indigo-500 to-emerald-500 w-full mt-6" variant="solid" isLoading={isLoading} size="lg" type="submit">
        <p className="text-white">Đăng nhập</p>
      </Button>
    </form>
  );
};

export default LoginForm;
