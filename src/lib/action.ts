"use server";
import { redirect } from "next/navigation";
import prisma from "./db";
import { readUserData } from "./supabase/readUser";
import { generateRandomUsername } from "./utils";

export const createUser = async (email: string, id: string) => {
  const user = await prisma.user.create({
    data: {
      email,
      id,
      username: generateRandomUsername(email),
    },
  });
  return user;
};

export const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
  });
  return user;
};

export const createLogo = async (
  logoUrls: string[],
  prompt: string,
  userId: string
) => {
  const data = await prisma.logo.create({
    data: {
      prompt,
      urls: logoUrls,
      userId,
    },
  });
  return data;
};

export const getLogo = async (id: string) => {
  const logo = await prisma.logo.findUnique({
    where: { id },
  });
  return logo;
};

export const getLogos = async (userId: string) => {
  const logos = await prisma.logo.findMany({
    where: { userId },
    orderBy: {
      createdAt: "desc",
    },
  });
  return logos;
};

export const getAllLogos = async () => {
  const logos = await prisma.logo.findMany({
    where: {
      public: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return logos;
};

export const getUser = async (userId: string) => {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
    });
    return user;
  } catch (error) {}
};

export const favoriteLogo = async (logoId: string, userId: string) => {
  const logo = await prisma.logo.findUnique({
    where: { id: logoId, userId },
  });

  if (!logo) {
    throw new Error("Logo not found");
  }

  const favorite = await prisma.favorite.create({
    data: {
      user: { connect: { id: userId } },
      logo: { connect: { id: logoId } },
    },
  });

  return favorite;
};

export const makeLogoPublic = async (logoId: string, userId: string) => {
  const logo = await prisma.logo.update({
    where: { id: logoId, userId },
    data: {
      public: true,
    },
  });
  return logo;
};

export const makeLogoNotPublic = async (logoId: string, userId: string) => {
  const logo = await prisma.logo.update({
    where: { id: logoId, userId },
    data: {
      public: false,
    },
  });
  return logo;
};

export const isPublic = async (logoId: string, userId: string) => {
  const logo = await prisma.logo.findUnique({
    where: { id: logoId, userId, public: true },
  });
  return !!logo;
};
export const unfavoriteLogo = async (logoId: string, userId: string) => {
  const favorite = await prisma.favorite.delete({
    where: {
      id: await getFavoriteId(logoId, userId),
    },
  });
  return favorite;
};

export const isFavorite = async (logoId: string, userId: string) => {
  const favorite = await prisma.favorite.findFirst({
    where: {
      logoId,
      userId,
    },
  });
  return !!favorite;
};

const getFavoriteId = async (logoId: string, userId: string) => {
  const favorite = await prisma.favorite.findFirst({
    where: {
      logoId,
      userId,
    },
    select: {
      id: true,
    },
  });
  return favorite?.id;
};

export const getFavoriteLogos = async (userId: string) => {
  const favorites = await prisma.favorite.findMany({
    where: { userId },
    include: {
      logo: true,
    },
  });

  const favoriteLogos = favorites.map((favorite) => favorite.logo);

  return favoriteLogos;
};

// Update your data fetching functions:
export const getInitialLogos = async (BATCH_SIZE: number) => {
  const totalCount = await prisma.logo.count();
  const logos = await prisma.logo.findMany({
    take: BATCH_SIZE,
    orderBy: {
      createdAt: "desc",
    },
  });
  return { logos, totalCount };
};

export const fetchMoreLogos = async (skip: number, take: number) => {
  const logos = await prisma.logo.findMany({
    skip,
    take,
    orderBy: {
      createdAt: "desc",
    },
  });
  return logos;
};

export const getOrCreateUser = async () => {
  const user = await readUserData();
  let currentUser = null;

  if (user) {
    currentUser = await getUserById(user.id);
    if (!currentUser) {
      await createUser(user.email as string, user.id);
      currentUser = await getUserById(user.id);
    }
  } else {
    redirect("/signin");
  }

  return currentUser;
};
