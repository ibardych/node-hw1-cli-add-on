const fs = require("fs/promises");
const path = require("path");
const { nanoid } = require("nanoid");

const fileOperation = async ({ action, filepath, data }) => {
  switch (action) {
    case "read":
      const text = await fs.readFile(filepath, "utf-8");
      return JSON.parse(text);
    case "write":
      await fs.writeFile(filepath, data);
      break;
    default:
      console.log("Unknown action");
  }
};

const contactsPath = path.resolve("db", "contacts.json");

async function listContacts() {
  const contacts = await fileOperation({
    action: "read",
    filepath: contactsPath,
  });
  console.table(contacts);
}

async function getAllContacts() {
  const contacts = await fileOperation({
    action: "read",
    filepath: contactsPath,
  });
  return contacts;
}

async function updateContacts(contacts) {
  await fileOperation({
    action: "write",
    filepath: contactsPath,
    data: JSON.stringify(contacts),
  });
}

async function getContactById(contactId) {
  const contacts = await getAllContacts();
  const contact = contacts.filter((item) => item.id === contactId);
  console.log(contact);
}

async function removeContact(contactId) {
  const contacts = await getAllContacts();
  const contact = contacts.filter((item) => item.id === contactId);
  if (!contact.length) {
    return null;
  }
  const filteredContacts = contacts.filter((item) => item.id !== contactId);
  await updateContacts(filteredContacts);
  console.log(contact);
  return contact;
}

async function addContact(name, email, phone) {
  const contacts = await getAllContacts();
  const contact = contacts.filter((item) => item.email === email);
  if (contact.length) {
    return null;
  }

  const newContact = { id: nanoid(20), name, email, phone };
  contacts.push(newContact);
  await updateContacts(contacts);
  console.log(newContact);
  return newContact;
}

module.exports = { listContacts, getContactById, removeContact, addContact };
