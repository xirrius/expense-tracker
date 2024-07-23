import RegisterForm from "../components/molecules/RegisterForm";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const Register = () => {
  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4 mt-12">
      <h1 className="text-4xl font-bold">Register</h1>
      <p>Enter your email to login</p>
      <Card className="w-2/4 ">
        <CardHeader>
          <CardTitle>Hello User</CardTitle>
        </CardHeader>
        <CardContent>
          <RegisterForm></RegisterForm>
        </CardContent>
      </Card>
    </main>
  );
}
export default Register