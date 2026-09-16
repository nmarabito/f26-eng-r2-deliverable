"use client";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import type { Database } from "@/lib/schema";

// functionality for users to edit a species' information
export default function EditSpecies({ userId }: { userId: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <Icons.add className="mr-3 h-5 w-5" />
          Edit Species
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-y-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
          <DialogDescription>
            Edit your species here.
          </DialogDescription>
        </DialogHeader>
        <p>Which species would you like to edit?</p>
        <Form>
            {/* Form fields for editing species will go here */}
        </Form>
        <DialogClose asChild>
          <Button>Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

//📝 **Add the functionality for users to edit a species’ information.**

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

