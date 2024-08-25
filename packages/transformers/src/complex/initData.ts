import { camelToSnake } from '@telegram-apps/toolkit';
import type { Chat, InitData, User } from '@telegram-apps/types';

import type { Schema, TransformFn } from '@/types.js';

import { object } from '@/transformers/object.js';
import { boolean as createBoolean } from '@/transformers/boolean.js';
import { string as createString } from '@/transformers/string.js';
import { number as createNumber } from '@/transformers/number.js';
import { date } from '@/transformers/date.js';
import { searchParams } from '@/transformers/searchParams.js';
import { createTransformerGen } from '@/transformers/createTransformerGen.js';

function toSnakeCaseSource<T>(schema: { [K in keyof T]: TransformFn<T[K]> }): Schema<T> {
  for (const key in schema) {
    (schema as any)[key] = [camelToSnake(key), schema[key]];
  }
  return schema;
}

export const initData = createTransformerGen<InitData>(
  'initData',
  value => {
    const number = createNumber();
    const numberOptional = createNumber(true);
    const string = createString();
    const stringOptional = createString(true);
    const boolOptional = createBoolean(true);

    const user = object<User>(toSnakeCaseSource({
      addedToAttachmentMenu: boolOptional,
      allowsWriteToPm: boolOptional,
      firstName: string,
      id: number,
      isBot: boolOptional,
      isPremium: boolOptional,
      languageCode: stringOptional,
      lastName: stringOptional,
      photoUrl: stringOptional,
      username: stringOptional,
    }), 'User')(true);

    return searchParams<InitData>(
      toSnakeCaseSource({
        authDate: date(),
        canSendAfter: numberOptional,
        chat: object<Chat>(
          toSnakeCaseSource({
            id: number,
            type: string,
            title: string,
            photoUrl: stringOptional,
            username: stringOptional,
          }),
          'Chat',
        )(true),
        chatInstance: stringOptional,
        chatType: stringOptional,
        hash: string,
        queryId: stringOptional,
        receiver: user,
        startParam: stringOptional,
        user,
      }),
      'InitData',
    )()(value);
  },
);

export type { InitData };