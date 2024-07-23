
import {z} from "zod"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import {signInWithEmailAndPassword} from 'firebase/auth'
import { auth } from "../../lib/firebase"
import { useNavigate } from "react-router-dom";
import useStore from "../../store"

const formSchema = z.object({
  email: z.string().email({
    message:"Please enter a valid email"
  }), 
  password: z.string().min(5, {
    message:"Password should have at least five characters"
  }),
});

const LoginForm = () => {

    const {logIn} = useStore()
    const navigate = useNavigate()

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        email: "",
        password: "",
      },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
       await signInWithEmailAndPassword(auth, values.email, values.password).then((userCredential) => {
           const user = userCredential.user
           console.log(user);
           logIn()
           navigate("/")
       }).catch((error) => {
        const errorCode = error.code
        const errorMessage = error.message
        console.log(errorCode, errorMessage);
        
       })
        
    }    

  return (
    
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="" {...field} type="password" />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">Login</Button>
      </form>
    </Form>
  );
}
export default LoginForm