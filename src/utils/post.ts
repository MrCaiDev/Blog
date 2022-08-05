import { readdir, readFile } from "fs/promises";
import matter from "gray-matter";
import { join } from "path";
import { cwd } from "process";
import { DEFAULT_DESCRIPTION, DEFAULT_TITLE, DEFAULT_TOPIC } from "./constants";

const postsDirectory = join(cwd(), "posts");

export interface IPost {
  path: string;
  createdAt: string;
  title: string;
  description: string;
  topic: string;
  content: string;
}

export async function getPostByFilename(filename: string) {
  const file = join(postsDirectory, filename);
  const fileContent = await readFile(file, { encoding: "utf-8" });
  const { data, content } = matter(fileContent);

  const path = filename.replace(/\.md$/, "");
  const createdAt = new Date(data.createdAt).toLocaleDateString("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
  const title = data.title ?? DEFAULT_TITLE;
  const description = data.description ?? DEFAULT_DESCRIPTION;
  const topic = data.topic ?? DEFAULT_TOPIC;

  return {
    path,
    createdAt,
    title,
    description,
    topic,
    content,
  } as IPost;
}

export async function getAllPosts() {
  const filenames = await readdir(postsDirectory);
  return Promise.all(
    filenames
      .filter((filename) => filename.endsWith(".md"))
      .map(getPostByFilename)
  );
}