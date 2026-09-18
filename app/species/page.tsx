import { Separator } from "@/components/ui/separator";
import { TypographyH2 } from "@/components/ui/typography";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";
import AddSpeciesDialog from "./add-species-dialog";
import EditSpecies from "./edit-species-dialogue";
import SpeciesCard from "./species-card";
import SpeciesSearch from "./species-search";

export default async function SpeciesList({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  // Create supabase server component client and obtain user session from stored cookie
  const supabase = await createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    // this is a protected route - only users who are signed in can view this route
    redirect("/");
  }

  // Obtain the ID of the currently signed-in user
  const sessionId = session.user.id;

  const { data: species } = await supabase.from("species").select("*").order("id", { ascending: false });

  // obtain an array of the species authored by the currently signed-in user
  // this array is later passed down as a prop to EditSpecies
  const userSpecies = species?.filter((s) => s.author === sessionId) ?? [];

  // filter species by substring match (case-insensitive) on scientific name, common name, or description
  const { q } = await searchParams;
  const query = q?.toLowerCase() ?? "";
  const filteredSpecies =
    species?.filter(
      (s) =>
        s.scientific_name.toLowerCase().includes(query) ||
        (s.common_name?.toLowerCase().includes(query) ?? false) ||
        (s.description?.toLowerCase().includes(query) ?? false),
    ) ?? [];

  return (
    <>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <TypographyH2>Species List</TypographyH2>
        <div className="min-w-[200px] flex-1">
          <SpeciesSearch />
        </div>
        <div className="flex gap-4">
          <EditSpecies userSpecies={userSpecies} /> {/* Edit species button */}
          <AddSpeciesDialog userId={sessionId} />
        </div>
      </div>
      <Separator className="my-4" />
      <div className="flex flex-wrap justify-center">
        {filteredSpecies.map((species) => (
          <SpeciesCard key={species.id} species={species} />
        ))}
      </div>
    </>
  );
}
