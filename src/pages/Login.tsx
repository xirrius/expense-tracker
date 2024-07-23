import { Link } from "react-router-dom";
import LoginForm from "../components/molecules/LoginForm";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";

const Login = () => {
  // const navigate = useNavigate()

  // useEffect(() => {
  //   if(!auth.currentUser) {
  //     navigate('/')
  //   }
   
  // }, [])
  

  return (
    <main className="flex flex-col h-screen justify-center items-center gap-4">
      <h1 className="text-4xl font-bold">Login</h1>
      <p>Enter your email to login</p>
      <Card className="w-2/4 ">
        <CardHeader>
          <CardTitle>Hello User</CardTitle>
        </CardHeader>
        <CardContent>
          <LoginForm></LoginForm>
        </CardContent>
        <CardFooter>
          <Link to={"/register"} className="text-indigo-700 text-sm">
            <u>New here? Create an Account.</u>
          </Link>
        </CardFooter>
      </Card>
    </main>
  );
};
export default Login;
