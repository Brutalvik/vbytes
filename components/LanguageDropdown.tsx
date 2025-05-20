"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLanguages } from "@/store/slices/languageSlice";
import { selectLanguages, selectLoading } from "@/store/slices/selectors";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { AppDispatch } from "@/store/store";

const LanguageDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();
  const languages = useSelector(selectLanguages);
  const loading = useSelector(selectLoading);

  const [selectedKey, setSelectedKey] = useState("en"); // ✅ Default to English (US)

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <Autocomplete
      className="max-w-xs"
      size="sm" // 🔽 Smaller input height
      selectedKey={selectedKey}
      onSelectionChange={(key) => setSelectedKey(key as string)}
      listboxProps={{
        itemClasses: {
          base: "py-2", // ✅ Gap between dropdown options
        },
      }}
      inputProps={{
        classNames: {
          input: "h-8 text-sm", // 🔽 Reduces actual input box height and font size
        },
      }}
    >
      {languages?.map(({ key, flagUrl, language }) => (
        <AutocompleteItem
          key={key}
          startContent={
            <Avatar
              src={flagUrl}
              className="w-4 h-4" // 🔽 Smaller avatar
            />
          }
        >
          {language}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default LanguageDropdown;
