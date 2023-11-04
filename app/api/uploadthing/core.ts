import { isTeacher } from "@/actions/teacher";
import { auth } from "@clerk/nextjs";
import { createUploadthing, type FileRouter } from "uploadthing/next";
 
const f = createUploadthing();
 
const handleAuth = () => {
    const { userId } = auth();

    const isAuthorized = isTeacher(userId);
    // only the specified teachers can uplaod files
    if(!userId || !isAuthorized) throw new Error("Unauthorized");
    return { userId }
}; 
 
// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  courseImage: f({ image: { maxFileSize: '4MB', maxFileCount: 1 } })
//   Set permissions and file types for this FileRoute
  .middleware(handleAuth)
  .onUploadComplete(() => {
    // This code RUNS ON YOUR SERVER after upload
    // console.log("Upload complete for userId:", metadata.userId);

    // console.log("file url", file.url);
  }),
  courseAttachment: f(["text", "image", "video", "audio", "pdf"])
  .middleware(handleAuth)
  .onUploadComplete(() => {

  }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB"}})
  .middleware(handleAuth)
  .onUploadComplete(() => {

  }),

} satisfies FileRouter;
 
export type OurFileRouter = typeof ourFileRouter;