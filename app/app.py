import requests
import os


ENDPOINT = "http://127.0.0.1:3001"


class Pokemon:
    pokemon = None
    search = ""

    def __init__(self, search: str):
        self.search = search.lower()

    def get_data(self):
        try:
            request = requests.get("{0}/{1}".format(ENDPOINT, self.search))
            pokemon = request.json()
            self.pokemon = pokemon
            self.get_id()
            self.get_name()
            self.get_types()
            self.get_encounter_locations()
            self.get_stats()
        except requests.exceptions.ConnectionError as e:
            print("Connection to the API endpoint failed.\n")
        except Exception as e:
            print("An error occurs:")
            print(e)
            print()

    def get_id(self):
        print("ID: {}".format(self.pokemon["id"]))

    def get_name(self):
        print("Name: {}".format(self.pokemon["name"].title()))

    def get_types(self):
        print("\nTypes:")
        for item in self.pokemon["types"]:
            print(
                "- {0} (slot: {1})".format(item["type"]["name"].title(), item["slot"])
            )

    def get_encounter_locations(self):
        print("\nEncounter Locations: ", end="")
        if len(self.pokemon["location_area_encounters"]) == 0:
            print("-\n")
        else:
            print()
            for item in self.pokemon["location_area_encounters"]:
                print("- {}".format(item["name"]))
                print("  Methods:")
                for method in item["methods"]:
                    print("    - {}".format(method))

                print()

    def get_stats(self):
        print("Stats:")
        for item in self.pokemon["stats"]:
            print(
                "- {0}: {1}".format(
                    self.format_stat_label(item["stat"]["name"]), item["base_stat"]
                )
            )
            print("  Effort: {}".format(item["effort"]))
            print()

    def format_stat_label(self, stat: str):
        if stat == "hp":
            return "HP"

        return " ".join(stat.split("-")).title()


def clear_console():
    command = "clear"
    if os.name in ("nt", "dos"):
        command = "cls"

    os.system(command)


def print_commands():
    print("Commands:")
    print("1  : Search for Pokemon")
    print("0  : Exit")
    print()


def main():
    print_commands()
    while True:
        command = input("Please input command: ")
        if command == "1":
            clear_console()
            search = input("Please search using Pokemon's name or ID: ")
            pokemon = Pokemon(search)
            pokemon.get_data()
        elif command == "0":
            exit()
        else:
            print("Command undefined.\n")


if __name__ == "__main__":
    main()
