"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import type { Database } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState, type BaseSyntheticEvent } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

type Species = Database["public"]["Tables"]["species"]["Row"];

// Define kingdom enum for use in Zod schema and displaying dropdown options in the form
const kingdoms = z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]);

// Use Zod to define the shape + requirements of a Species entry; used in form validation
const speciesSchema = z.object({
  scientific_name: z
    .string()
    .trim()
    .min(1)
    .transform((val) => val?.trim()),
  common_name: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  kingdom: kingdoms,
  total_population: z.number().int().positive().min(1).nullable(),
  image: z
    .string()
    .url()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
  description: z
    .string()
    .nullable()
    // Transform empty string or only whitespace input to null before form submission, and trim whitespace otherwise
    .transform((val) => (!val || val.trim() === "" ? null : val.trim())),
});

type FormData = z.infer<typeof speciesSchema>;

// Default values for the form fields, shown until a species is selected from the dropdown
const defaultValues: Partial<FormData> = {
  scientific_name: "",
  common_name: null,
  kingdom: "Animalia",
  total_population: null,
  image: null,
  description: null,
};

// functionality for users to edit the information of species they have authored
// (the userSpecies prop comes from species/page.tsx)
export default function EditSpecies({ userSpecies }: { userSpecies: Species[] }) {
  const router = useRouter();

  // control open/closed state of the dialog
  const [open, setOpen] = useState<boolean>(false);

  // track which of the user's species is currently selected for editing
  const [selectedId, setSelectedId] = useState<string>("");
  const selectedSpecies = userSpecies.find((species) => species.id.toString() === selectedId);

  // control open/closed state of the delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues,
    mode: "onChange",
  });

  const handleSelectSpecies = (value: string) => {
    setSelectedId(value);
    const species = userSpecies.find((s) => s.id.toString() === value);
    
    // fill the form with the existing data for the selected species so that user can update it
    if (species) {
      form.reset({
        scientific_name: species.scientific_name,
        common_name: species.common_name,
        kingdom: species.kingdom,
        total_population: species.total_population,
        image: species.image,
        description: species.description,
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedSpecies) {
      return;
    }

    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase.from("species").delete().eq("id", selectedSpecies.id);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setDeleteDialogOpen(false);
    setOpen(false);
    setSelectedId("");
    form.reset(defaultValues);

    // refresh the server-rendered species list to remove the deleted species
    router.refresh();

    return toast({
      title: "Species deleted!",
      description: "Successfully deleted " + selectedSpecies.scientific_name + ".",
    });
  };

  const onSubmit = async (input: FormData) => {
    if (!selectedSpecies) {
      return toast({
        title: "Select a species",
        description: "Please choose a species to edit before submitting.",
        variant: "destructive",
      });
    }

    // update any fields that have been changed
    const supabase = createBrowserSupabaseClient();
    const { error } = await supabase
      .from("species")
      .update({
        common_name: input.common_name,
        description: input.description,
        kingdom: input.kingdom,
        scientific_name: input.scientific_name,
        total_population: input.total_population,
        image: input.image,
      })
      .eq("id", selectedSpecies.id);

    if (error) {
      return toast({
        title: "Something went wrong.",
        description: error.message,
        variant: "destructive",
      });
    }

    setOpen(false);
    setSelectedId("");
    form.reset(defaultValues);

    // refresh the server-rendered species list to display the edited species
    router.refresh();

    return toast({
      title: "Species updated!",
      description: "Successfully updated " + input.scientific_name + ".",
    });
  };

  // modeled on the AddSpeciesDialog component
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icons.add className="mr-3 h-5 w-5" />
          Edit Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>Select one of your species below to edit its information.</DialogDescription>
        </DialogHeader>
        <div className="grid w-full items-center gap-4">
          <div className="space-y-2">
            <Label htmlFor="species-picker">Species</Label>
            <Select onValueChange={handleSelectSpecies} value={selectedId}>
              <SelectTrigger id="species-picker">
                <SelectValue placeholder="Select a species" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {userSpecies.map((species) => (
                    <SelectItem key={species.id} value={species.id.toString()}>
                      {species.scientific_name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
        {selectedSpecies && (
          <Form {...form}>
            <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
              <div className="grid w-full items-center gap-4">
                <FormField
                  control={form.control}
                  name="scientific_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Scientific Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Cavia porcellus" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="common_name"
                  render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Common Name</FormLabel>
                        <FormControl>
                          <Input value={value ?? ""} placeholder="Guinea pig" {...rest} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="kingdom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kingdom</FormLabel>
                      <Select onValueChange={(value) => field.onChange(kingdoms.parse(value))} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a kingdom" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {kingdoms.options.map((kingdom, index) => (
                              <SelectItem key={index} value={kingdom}>
                                {kingdom}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="total_population"
                  render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Total population</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            value={value ?? ""}
                            placeholder="300000"
                            {...rest}
                            onChange={(event) => field.onChange(+event.target.value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input
                            value={value ?? ""}
                            placeholder="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/George_the_amazing_guinea_pig.jpg/440px-George_the_amazing_guinea_pig.jpg"
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => {
                    const { value, ...rest } = field;
                    return (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            value={value ?? ""}
                            placeholder="The guinea pig or domestic guinea pig, also known as the cavy or domestic cavy, is a species of rodent belonging to the genus Cavia in the family Caviidae."
                            {...rest}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <div className="flex">
                  <Button
                    type="button"
                    className="ml-1 mr-1 flex-auto"
                    variant="destructive"
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    Delete Species
                  </Button>
                </div>
                <div className="flex">
                  <Button type="submit" className="ml-1 mr-1 flex-auto">
                    Save Changes
                  </Button>
                  <DialogClose asChild>
                    <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </form>
          </Form>
        )}
        {/* if the userSpecies array is empty, display this message to the user */}
        {userSpecies.length === 0 && (
          <p className="text-sm text-muted-foreground">You haven&apos;t added any species yet.</p>
        )}
      </DialogContent>
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete species</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedSpecies?.scientific_name}?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={() => void handleDelete()}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Dialog>
  );
}

// INSTRUCTIONS FROM NOTION

// 📝 **Add the functionality for users to edit a species’ information.**

//Right now, there is no functionality for users to edit an existing species’ information.
//  Implement functionality that allows users to edit information of 
// **species that they have created**. (In other words, this editing 
// functionality should only be available for species created by the user. 
// See hints below!)

//
//🌟 **Hints:**
//- `AddSpeciesDialog()` contains a form, so it should be a helpful reference for you 
// to adapt to your implementation of editing.
//**-** `ProfileForm()` in ****`app/settings/profile/profile-form.tsx` should also 
// be a helpful reference for editing.
//- You should consult the Supabase documentation for guidance on editing existing 
// entries in the database. 
//**-** In the `SpeciesList()` component at `app/species/page.tsx`, the ID of the 
// current logged-in user has already been fetched and stored in a `sessionId` variable. 
// This will be helpful in determining whether the current user is the author of a given 
// species.
//- Supabase has already been configured to prevent non-author users from editing species.
//  So no need to do any Supabase configuration on the backend; you simply need to
//  hide or disable editing functionality on the frontend for species the user hasn’t 
// created!
//- If needed, you can consult the documentation for React Hook Form and Zod to 
// understand how form schema validation has been implemented.

