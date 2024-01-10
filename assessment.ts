import axios from "axios";
import * as fs from "fs";

interface Character {
  name: string;
  height: string;
  gender: string;
}

async function fetchAllCharacters(): Promise<any[]> {
  let allCharacters: any[] = [];

  const response = await axios.get(`https://swapi.dev/api/people/`);
  const data: any = response;

  const characters = data.results.map(
    (character: { name: any; height: any; gender: any }) => ({
      name: character.name,
      height: character.height,
      gender: character.gender,
    })
  );

  allCharacters = [...allCharacters, ...characters];

  return allCharacters;
}

function sortAndCategorizeCharacters(characters: Character[]): void {
  const maleCharacters: Character[] = [];
  const femaleCharacters: Character[] = [];
  const unknownGenderCharacters: Character[] = [];

  characters.forEach((character) => {
    if (character.gender === "male") {
      maleCharacters.push(character);
    } else if (character.gender === "female") {
      femaleCharacters.push(character);
    } else {
      unknownGenderCharacters.push(character);
    }
  });

  const sortedCharacters: Character[] = [
    ...maleCharacters.sort((a, b) =>
      a.height === "unknown" ? 1 : parseInt(a.height) - parseInt(b.height)
    ),
    ...femaleCharacters.sort((a, b) =>
      a.height === "unknown" ? 1 : parseInt(a.height) - parseInt(b.height)
    ),
    ...unknownGenderCharacters.sort((a, b) => (a.name < b.name ? -1 : 1)),
  ];

  const output = {
    maleCharacters: sortedCharacters.filter(
      (character) => character.gender === "male"
    ),
    femaleCharacters: sortedCharacters.filter(
      (character) => character.gender === "female"
    ),
    unknownGenderCharacters: sortedCharacters.filter(
      (character) => character.gender === "unknown"
    ),
  };

  fs.writeFileSync("output.json", JSON.stringify(output, null, 2));
}

(async () => {
  const characters = await fetchAllCharacters();
  sortAndCategorizeCharacters(characters);
})();
