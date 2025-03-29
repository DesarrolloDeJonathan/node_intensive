// This file is the equivalent of the .env file in nodejs, where environment variables are stored. It should not be uploaded to the remote repository. However, since it is not a real project, I am uploading it so you can see how it is done.
export const config = {
  jwSecret: process.env.JWT_SECRET as string || "My_Secret_Key",
  port:process.env.PORT as string || 4000,
}

export default config;