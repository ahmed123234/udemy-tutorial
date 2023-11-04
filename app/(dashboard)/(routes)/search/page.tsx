import db from "@/lib/db"
import Categories from "./_components/categories";
import SearchInput from "@/components/search-input";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs";
import { redirect, useSearchParams } from "next/navigation";
import { CoursesList } from "@/components/courses-list";
// every thing within the pathname can be accessed by the server components using serachParams props

type SearchPageProps = {
  searchParams: {
    title: string;
    categoryId: string;
  }
}
const Search = async ({ searchParams } : SearchPageProps) => {
  const { userId } = auth();

  if(!userId) {
    return redirect("/");
  }

  const categories =  await db.category.findMany({
    orderBy: {
      name: "asc"
    }
  });

  const { categoryId, title } = searchParams;

  const courses = await getCourses({ userId, title, categoryId });
  // console.log(categoryId, title)

  return (
    <>
      <div className="px-6 pt-6 md:hidden md:mb-0 block">
        <SearchInput />
      </div>

      <div className="p-6 space-y-4">
      <Categories  items={categories}/>
      <CoursesList items={courses} />
    </div>
    </>
  )
}

export default Search