"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLanguages,
} from "@/store/slices/languageSlice"; 
import { selectLanguages, selectLoading } from "@/store/slices/selectors";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Avatar } from "@heroui/avatar";
import { AppDispatch } from "@/store/store"; 

const LanguageDropdown = () => {
  const dispatch = useDispatch<AppDispatch>();

  const languages = useSelector(selectLanguages);
  const loading = useSelector(selectLoading);

  console.log("Languages:", languages);
  console.log("Loading:", loading);

  useEffect(() => {
    dispatch(fetchLanguages()); 
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;

  return (
    <Autocomplete className="max-w-xs" label="Select a language">
      {languages?.map(({code, flagUrl, language}) => (
        <AutocompleteItem
          key={code}
          startContent={<Avatar src={flagUrl} />}
        >
          {language}
        </AutocompleteItem>
      ))}
    </Autocomplete>
  );
};

export default LanguageDropdown;
