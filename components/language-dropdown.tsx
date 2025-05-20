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

  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchLanguages());
  }, [dispatch]);

  useEffect(() => {
    if (languages.length > 0 && !selectedKey) {
      setSelectedKey(languages[0].key); // ✅ Set first language as default
    }
  }, [languages, selectedKey]);

  const handleChange = (key: string | null) => {
    setSelectedKey(key);
    const selectedLanguage = languages.find((lang) => lang.key === key);
    console.log("Selected language:", selectedLanguage);
    return selectedLanguage;
  };
  
  return (
    <Autocomplete
      aria-labelledby="Language"
      className="max-w-xs"
      size="sm"
      selectedKey={selectedKey || undefined}
      onValueChange={handleChange}
      listboxProps={{
        itemClasses: {
          base: "py-2",
        },
      }}
      inputProps={{
        classNames: {
          input: "h-8 text-sm",
        },
      }}
    >
      {languages.map(({ key, flagUrl, language }) => (
        <AutocompleteItem
          key={key}
          startContent={<Avatar src={flagUrl} className="w-4 h-4" />}
        >
          {language}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default LanguageDropdown;
