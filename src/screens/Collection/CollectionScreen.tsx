import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from "react-native";

import { useMemo, useState , useEffect } from "react";
import { router } from "expo-router";
import { getWildDex, DexSpecies } from "@/api/dex";

import { Colors } from "@/theme/colors";

import CollectionHeader from "@/components/collection/CollectionHeader";
import CollectionFilters from "@/components/collection/CollectionFilters";
import CollectionCard from "@/components/collection/CollectionCard";
import { Typography } from "@/theme/typography";
import { Spacing } from "@/theme/spacing";
import { Radius } from "@/theme/radius";
import { Shadows } from "@/theme/shadows";

export default function CollectionScreen() {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [search, setSearch] = useState("");

  const [species, setSpecies] = useState<DexSpecies[]>([]);
const [discoveredCount, setDiscoveredCount] = useState(0);
const [totalSpecies, setTotalSpecies] = useState(0);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchDex = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getWildDex();

      setSpecies(data.species);
      setDiscoveredCount(data.discoveredSpecies);
      setTotalSpecies(data.totalSpecies);
    } catch (error) {
      console.error("Wild Dex error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Failed to load Wild Dex"
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDex();
}, []);

const filteredSpecies = useMemo(() => {
  return species.filter((species) => {
      const matchesFilter =
        selectedFilter === "All" ||
        species.category === selectedFilter;

      const matchesSearch = species.name
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesFilter && matchesSearch;
    });
  }, [species, selectedFilter, search]);

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredSpecies}
        keyExtractor={(item) => item.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <>
           <CollectionHeader
  discovered={discoveredCount}
  total={totalSpecies}
/>

            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search species..."
              placeholderTextColor={Colors.textSecondary}
              style={styles.search}
            />

            <CollectionFilters
              selected={selectedFilter}
              onSelect={setSelectedFilter}
            />

            <Text style={styles.sectionTitle}>
              Wildlife
            </Text>
          </>
        }
        renderItem={({ item }) => (
          <CollectionCard
            species={item}
            onPress={() => {
              console.log("Selected:", item.name);

              router.push({
                pathname: "/species/[id]",
                params: {
                  id: item.id,
                },
              });
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>

            <Text style={styles.emptyTitle}>
              No species found
            </Text>

            <Text style={styles.emptyText}>
              Try another search or category.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  content: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 100,
  },

  search: {
    backgroundColor: Colors.surface,
    color: Colors.text,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 13,
    marginTop: 18,
    fontSize: 15,
  },

  sectionTitle: {
    color: Colors.text,
    fontSize: 20,
    fontWeight: "700",
    marginTop: 25,
    marginBottom: 15,
  },

  row: {
    justifyContent: "space-between",
  },

  empty: {
    alignItems: "center",
    paddingTop: 50,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
  },

  emptyText: {
    color: Colors.textSecondary,
    marginTop: 5,
  },
});