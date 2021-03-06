import { db } from "@/firebase/config";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { Ref, ref, watchEffect } from "vue";
import Collection from "@/types/Collection";

const getCollection = <T extends Collection>(c: string) => {
  const documents = ref<T[]>([]) as Ref<T[]>;
  const error = ref<string>("") as Ref<string>;

  const unsub = onSnapshot(
    query(collection(db, c), orderBy("createdAt", "desc")),
    (snap) => {
      console.log("snapshot");
      documents.value = snap.docs.map(
        (doc) => ({ ...doc.data(), id: doc.id } as T)
      );
    },
    (err) => {
      console.log(err.message);
      error.value = err.message;
    }
  );

  watchEffect((onInvalidate) => onInvalidate(unsub));

  return { documents, error };
};

export default getCollection;
