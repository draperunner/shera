import * as React from "react";
import { type Attendee, type User, type Event } from "@prisma/client";
import { EventEmail } from "./components/EventEmail";

type MaybeAttending3Days = {
  event: Event & { host: User; attendees: Attendee[] };
};

export const MaybeAttending3Days = ({ event }: MaybeAttending3Days) => {
  const attendPrompt = `${event.title} is happening in 3 days and your attendance is set to maybe, let ${event.host.name ? event.host.name : "the host"} know if you are coming!`;

  return (
    <EventEmail
      event={event}
      previewText={`Are you attending ${event.title}?`}
      aboveText="Are you attending"
      bodyText={attendPrompt}
    />
  );
};

export default MaybeAttending3Days;

MaybeAttending3Days.PreviewProps = {
  event: {
    eventId: 42,
    publicId: "publicId",
    description: "Vi spiser noe pils og drikker en pizza",
    title: "4 Pils og en Pizza",
    place: "Jens Bjelkes gate 72",
    hostId: "hostId",
    dateTime: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
    host: {
      id: "hostId",
      name: "Aslak Hollund",
      email: "aslak@shera.no",
      emailVerified: new Date(),
      image: null,
    },
    attendees: [
      {
        attendeeId: "attendeeId",
        name: "Aslak Hollund",
        email: "aslak@shera.no",
        eventId: 42,
        status: "MAYBE",
        userId: "userId",
      },
    ],
  },
} satisfies MaybeAttending3Days;
