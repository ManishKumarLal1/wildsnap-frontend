import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

import { Species } from "@/types/Species";
import { Observation } from "@/types/Observation";
import { User } from "@/types/User";

import { getAchievements } from "@/utils/achievements";

import {
  calculateNewStreak,
  getTodayDate,
} from "@/utils/streak";

import {
  calculateLevel,
  calculateObservationXP,
} from "@/utils/xp";

export interface AchievementNotification {
  id: string;
  title: string;
  description: string;
  icon: string;
  rewardXP: number;
}


interface UserStoreType {
  user: User;

  collection: Species[];

  observations: Observation[];

  unlockedAchievementIds: string[];

  achievementNotifications: AchievementNotification[];

  setUser: (user: User) => void;
  setCollection: (collection: Species[]) => void;

  addObservation: (
    observation: Observation,
    species: Species
  ) => void;

  removeAchievementNotification: (
    id: string
  ) => void;

  syncObservationFromBackend: (
  observation: Observation,
  rewards: {
    xpEarned: number;
    totalXp: number;
    level: number;
    streak: number;
    firstDiscovery: boolean;
  },
  collectionData: {
    speciesId: string;
    discoveryCount: number;
  }
) => void;
}


/* -------------------------------- */
/* Default User */
/* -------------------------------- */

const defaultUser: User = {
  id: "user-1",

  username: "Manish",

  avatar: "👨‍💻",

  xp: 11820,

  level: calculateLevel(11820),

  speciesDiscovered: 0,

  streak: 0,

  lastObservationDate: null,

  location: "Jamshedpur",
};


/* -------------------------------- */
/* Context */
/* -------------------------------- */

const UserStoreContext =
  createContext<UserStoreType | undefined>(
    undefined
  );


/* -------------------------------- */
/* Provider */
/* -------------------------------- */

export function UserStoreProvider({
  children,
}: {
  children: ReactNode;
}) {

  const [user, setUser] =
    useState<User>(defaultUser);

  const [collection, setCollection] =
    useState<Species[]>([]);

  const [observations, setObservations] =
    useState<Observation[]>([]);

  const [
    unlockedAchievementIds,
    setUnlockedAchievementIds,
  ] = useState<string[]>([]);
  const [
  achievementNotifications,
  setAchievementNotifications,
] = useState<AchievementNotification[]>([]);


  /* -------------------------------- */
  /* Add Observation */
  /* -------------------------------- */

  const addObservation = (
    observation: Observation,
    species: Species
  ) => {

    /* ------------------------------ */
    /* 1. Check New Species */
    /* ------------------------------ */

    const isNewSpecies =
      !collection.some(
        (item) =>
          item.id === species.id
      );


    /* ------------------------------ */
    /* 2. Calculate Observation XP */
    /* ------------------------------ */

    const earnedXP =
      calculateObservationXP(
        species.rarity,
        isNewSpecies
      );


    /* ------------------------------ */
    /* 3. Save Observation */
    /* ------------------------------ */

    const savedObservation: Observation = {
      ...observation,

      xpEarned: earnedXP,
    };

    const newObservations = [
      ...observations,
      savedObservation,
    ];

    setObservations(newObservations);

    


    /* ------------------------------ */
    /* 4. Update Collection */
    /* ------------------------------ */

    const existingSpecies =
      collection.find(
        (item) =>
          item.id === species.id
      );

    let newCollection: Species[];


    if (existingSpecies) {

      // Already discovered

      newCollection =
        collection.map((item) =>
          item.id === species.id
            ? {
                ...item,

                discoveryCount:
                  item.discoveryCount + 1,
              }
            : item
        );

    } else {

      // First discovery

      newCollection = [
        ...collection,

        {
          ...species,

          discovered: true,

          discoveryCount: 1,
        },
      ];
    }

    setCollection(newCollection);


    /* ------------------------------ */
    /* 5. Update Streak */
    /* ------------------------------ */

    const today =
      getTodayDate();

    const newStreak =
      calculateNewStreak(
        user.streak,
        user.lastObservationDate,
        today
      );


    /* ------------------------------ */
    /* 6. Update User XP */
    /* ------------------------------ */

    const newXP =
      user.xp + earnedXP;


    const newUser: User = {

      ...user,

      xp: newXP,

      level: calculateLevel(newXP),

      speciesDiscovered:
        user.speciesDiscovered +
        (isNewSpecies ? 1 : 0),

      streak: newStreak,

      lastObservationDate: today,
    };


    setUser(newUser);


    /* ------------------------------ */
    /* 7. Check Achievements */
    /* ------------------------------ */

    const achievements =
      getAchievements(
        newUser,
        newCollection,
        newObservations
      );


    const newlyUnlocked =
      achievements.filter(
        (achievement) =>
          achievement.unlocked &&
          !unlockedAchievementIds.includes(
            achievement.id
          )
      );


    /* ------------------------------ */
    /* 8. Achievement XP */
    /* ------------------------------ */

    if (newlyUnlocked.length > 0) {
      const achievementXP = newlyUnlocked.reduce(
        (total, achievement) =>
          total + achievement.rewardXP,
        0
      );

      /* ---------------------------- */
      /* Save unlocked achievements */
      /* ---------------------------- */

      setUnlockedAchievementIds((previous) => [
        ...previous,
        ...newlyUnlocked.map(
          (achievement) => achievement.id
        ),
      ]);

      /* ---------------------------- */
      /* Create Notifications */
      /* ---------------------------- */

      const notifications = newlyUnlocked.map(
        (achievement) => ({
          id: `${achievement.id}-${Date.now()}`,
          title: achievement.title,
          description: achievement.description,
          icon: achievement.icon,
          rewardXP: achievement.rewardXP,
        })
      );

      setAchievementNotifications((previous) => [
        ...previous,
        ...notifications,
      ]);


      /* ---------------------------- */
      /* Give Achievement XP */
      /* ---------------------------- */

      setUser((previous) => {
        const finalXP = previous.xp + achievementXP;

        return {
          ...previous,
          xp: finalXP,
          level: calculateLevel(finalXP),
        };
      });
    }
  };

  
      /* ------------------------------ */
    /* Sync Observation from Backend */
    /* ------------------------------ */
const syncObservationFromBackend = (
  observation: Observation,
  rewards: {
    xpEarned: number;
    totalXp: number;
    level: number;
    streak: number;
    firstDiscovery: boolean;
  },
  collectionData: {
    speciesId: string;
    discoveryCount: number;
  }
) => {
  setObservations((previous) => [
    observation,
    ...previous,
  ]);

  setCollection((previous) => {
    const exists = previous.some(
      (species) => species.id === collectionData.speciesId
    );

    if (!exists) {
      return previous;
    }

    return previous.map((species) =>
      species.id === collectionData.speciesId
        ? {
            ...species,
            discovered: true,
            discoveryCount: collectionData.discoveryCount,
          }
        : species
    );
  });

  setUser((previous) => ({
    ...previous,
    xp: rewards.totalXp,
    level: rewards.level,
    streak: rewards.streak,
    speciesDiscovered: rewards.firstDiscovery
      ? previous.speciesDiscovered + 1
      : previous.speciesDiscovered,
    lastObservationDate: new Date()
      .toISOString()
      .split("T")[0],
  }));
};

  const removeAchievementNotification = (
    id: string
  ) => {
    setAchievementNotifications((previous) =>
      previous.filter(
        (notification) => notification.id !== id
      )
    );
  };

  /* -------------------------------- */
  /* Provider */
  /* -------------------------------- */

  return (
    <UserStoreContext.Provider
      value={{
  user,
  collection,
  observations,
  unlockedAchievementIds,
  achievementNotifications,
  setUser,
  addObservation,
  syncObservationFromBackend,
  removeAchievementNotification,
  setCollection,
}}
    >
      {children}
    </UserStoreContext.Provider>
  );
}


/* -------------------------------- */
/* Hook */
/* -------------------------------- */

export function useUserStore() {

  const context =
    useContext(
      UserStoreContext
    );


  if (context === undefined) {

    throw new Error(
      "useUserStore must be used inside UserStoreProvider"
    );
  }


  return context;
}