import { AzureMember } from "@fluidframework/azure-client";

export type Position = Readonly<{ x: number; y: number }>;

export type User = { userName: string, userId: string };

export type UserAvailability = {userId: string, availability: string};

export type NoteData = Readonly<{
  id: any;
  text?: string;
  author: User;
  position: Position;
  numLikesCalculated: number;
  didILikeThisCalculated: boolean;
  color: ColorId;
}>;

export type ColorId =
  | "Blue"
  | "Green"
  | "Yellow"
  | "Pink"
  | "Purple"
  | "Orange";

export type LikedNote = {
  text: string, 
  color: string, 
  author: AzureMember,
  numLikesCalculated: number
};
