
CREATE TABLE "Users" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email text,
    name text,
    pswhash text,
    profilepic bytea
);


CREATE TABLE "Resources_images" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    img_data bytea,
    resource_id integer REFERENCES "Resources"(id) ON DELETE CASCADE
);


CREATE TABLE "Resources" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name text,
    description text,
    type text,
    address text,
    country text,
    zipcode text,
    key text
);

CREATE TABLE "Resource_access" (
    id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    "userId" integer REFERENCES "Users"(id),
    "resourceId" integer REFERENCES "Resources"(id) ON DELETE CASCADE,
    "isAdmin" boolean
);