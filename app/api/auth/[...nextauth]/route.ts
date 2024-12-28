import { handlers } from "@/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers

// import NextAuth, { NextAuthConfig } from "next-auth";
// import credentials from "next-auth/providers/credentials";
// import Credentials from "next-auth/providers/credentials";

// const authOptions: NextAuthConfig = {
//     session: {
//         strategy: "jwt",
//     },
//     pages: {
//         signIn: "/login",
//     },
//     providers: [
//         Credentials({
//             type: "credentials",

//             credentials: {
//                 email: { label: "Email", type: "text",},
//                 password: { label: "Password", type: "password" },
//             },
//             authorize(credentials, req) {
//                 const { email, password } = credentials as {
//                     email: string;
//                     password: string;
//                 };
//                 if (email === "admin" && password === "admin") {
//                     return {
//                         id: "1",
//                         name: "admin",
//                         email: "admin",
//                         rol: "admin",
//                         state: "active",
//                         clientid: "1",
//                     };
//                 }
//                 return null;
//             },
//         }),
//     ],
// };

// export default NextAuth(authOptions);
//export const { GET, POST }  = NextAuth(authOptions)

