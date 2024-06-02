export enum Role {
  User = 'user',
  Owner = 'owner',
}

export enum State {
  Active = 'active',
  Inactive = 'inactive',
}

// exercise force type
export enum ForceType {
  PUSH = 'push',
  PULL = 'pull',
  STATIC = 'static',
}

//exercise type
export enum ExerciseType {
  STRENGTH = 'strength',
  CARDIO = 'cardio',
  WEIGHTLIFTING = 'weightlifting',
  POWERLIFTING = 'powerlifting',
  STRETCHING = 'stretching',
}

// muscle type for exercise
export enum MuscleType {
  BICEPS = 'biceps',
  CALVES = 'calves',
  CHEST = 'chest',
  FOREARMS = 'forearms',
  HAMSTRINGS = 'hamstrings',
  LATS = 'lats',
  LOWER_BACK = 'lower_back',
  MIDDLE_BACK = 'middle_back',
  NECK = 'neck',
  TRAPS = 'traps',
  TRICEPS = 'triceps',
  SHOULDERS = 'shoulders',
  ABDOMINALS = 'abdominals',
  QUADRICEPS = 'quadriceps',
  ADDUCTORS = 'adductors',
  ABDUCTORS = 'abductors',
  GLUTES = 'glutes',
}

// difficulty of exercise
export enum ExerciseLevel {
  BEGINNER = 'beginner',
  INTERMEDIATE = 'intermediate',
  EXPERT = 'expert',
}
