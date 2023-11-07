
LIQUIBASE
=======

## Liquibase Overview

Liquibase is an open-source, database-independent library for tracking, managing, and applying database schema changes. It was originally designed to allow for a clear audit of database activities and to help resolve the often difficult process of managing database changes.

Unlike most other database migration tools, Liquibase uses a changelog to track what changes (or refactorings) need to be applied to a database. This allows you to manage database changes through source control, making it easier to control the state of your database schema.

A changelog is a set of changeSets. Each changeSet is uniquely identified by an "id" and "author" attribute. The changes you want to apply to your database are contained within the changeSet tags.

## Implementing Liquibase in a MySQL + FastAPI Project

Let's walk through a high-level overview of the steps you would take to implement Liquibase into a MySQL + FastAPI project:

1 **Install Liquibase:** You can download the latest Liquibase version directly from the official website and follow the installation guide. You would then add it to your PATH to use it from any location in the terminal.

2 **Set Up Database:** Before you use Liquibase, you should have a database already set up. If you are using MySQL, you can do this using a tool like MySQL Workbench or from the command line.

3 **Create a Liquibase Project:** In your project directory, you need to create a new directory named liquibase (or any name you prefer). Inside this directory, you create a new changelog-master.xml file. This will be the root changelog file that includes references to all other changelogs.

4 **Set Up liquibase.properties File:** Create a liquibase.properties file in your liquibase directory. This will store the configuration settings for Liquibase, such as the database URL, driver, username, password, and the location of the changelog file. Here is an example:

```properties
changeLogFile: changelog-master.xml
url: jdbc:mysql://localhost:3306/yourDB
username: yourUsername
password: yourPassword
driver: com.mysql.cj.jdbc.Driver
```
5 **Create Changesets:** Changesets are the units of changes that you want to apply to the database. Each changeset should be atomic, meaning it should represent one logical change to the database that can be applied or rolled back. Changesets are added to a changelog file, which is then executed by Liquibase. Here's an example of a simple changeset that creates a table:

```xml
<databaseChangeLog xmlns="http://www.liquibase.org/xml/ns/dbchangelog"
                   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                   xsi:schemaLocation="http://www.liquibase.org/xml/ns/dbchangelog
                   http://www.liquibase.org/xml/ns/dbchangelog/dbchangelog-3.8.xsd">
    <changeSet id="1" author="yourname">
        <createTable tableName="your_table">
            <column name="id" type="int">
                <constraints primaryKey="true" nullable="false"/>
            </column>
            <column name="name" type="varchar(255)">
                <constraints nullable="false"/>
            </column>
        </createTable>
    </changeSet>
</databaseChangeLog>
```

6 **Running Liquibase:** Use the command line to navigate to your Liquibase project directory, then run Liquibase using the update command:

```bash
liquibase update
```
This command will apply all changesets that haven't been applied yet, in the order they appear in the changelog file(s).

## Practical scenario where Liquibase could be used effectively

**Scenario: E-commerce Website**

Consider that you're developing an e-commerce website with multiple services. At the beginning of the project, you're working with a simple database schema for product inventory.

As you progress, new requirements come in. You need to add support for discount codes, special promotions, and complex shipping rules. All these changes would require significant modifications to the existing database schema. Furthermore, your team is big, and different people might be working on different parts of the database.

Without a tool like Liquibase, managing these changes would be challenging. There's the risk of someone applying a change on their local machine and forgetting to tell others about it. There's also the issue of keeping the development, testing, staging, and production environments in sync.

In this situation, Liquibase can be extremely helpful:

1 **Version Control for Database Changes:** Each change to the database is recorded in a changeset within the Liquibase changelog. This is stored alongside your application code and thus, version controlled. Any developer can pull the latest version of the code and have an up-to-date schema.

2 **Rollbacks:** Liquibase provides the ability to rollback changes if necessary. If a recent schema change leads to unforeseen complications, you can rollback to the previous version.

3 **Multi-environment Consistency:** You can apply the same sets of changes to your development, staging, and production environments, ensuring they all have the same schema. This prevents errors that might otherwise come from the schema drifting between environments.

4 **Developer Coordination:** By committing database changes into a central system, it reduces the chances of conflicting changes. If two developers try to make changes that conflict, this will be discovered when the second developer tries to merge their changes.

5 **Auditability:** Liquibase provides an audit log of changes to the database, including what was changed and who changed it. This is valuable for both troubleshooting and compliance purposes.

6 **Database Agnostic**: If in future, due to scaling requirements, you decide to switch from MySQL to PostgreSQL or any other database, Liquibase changesets, being database agnostic (unless you've written raw SQL scripts), would still work and you'd be able to recreate your schema in the new database system.

This example provides an insight into the potential use case of Liquibase in a real-world project. Of course, like any tool, it's most effective when used correctly and consistently by the team.

## What will happen if I run liquibase update command and the dB tables are already present

If the tables already exist and you run the liquibase update command, Liquibase will attempt to execute the changes described in the changelog-master.xml file. Since the tables already exist, the database will throw an error because you're trying to create tables that already exist. This will stop the Liquibase update process, and Liquibase will report an error.

However, if you have already applied these changes using Liquibase before (i.e., these changes are already tracked by Liquibase), Liquibase will not try to create the tables again. Liquibase maintains a table named DATABASECHANGELOG in your database to keep track of what changes (or changeSets) have been applied. This table has a row for each changeSet that has been executed, and these rows include a unique identifier for the changeSet (its id, author, and filename). When you run liquibase update, it checks the DATABASECHANGELOG table to see if each changeSet has been executed before, and if so, it skips that changeSet.

If you're adding Liquibase to a project where the database schema already exists, you may wish to use the Liquibase generateChangeLog command to create a changelog file that represents the current state of the database. This changelog file can then serve as the basis for future database changes. But remember, generateChangeLog may not capture every detail of your database perfectly, particularly stored procedures, triggers, and certain types of constraints, so you will need to review and possibly edit the generated changelog file. After this, you can start adding your own changeSets for subsequent schema changes.

## Liquibase changeSet

A Liquibase `changeSet` is a collection of changes that you want to apply to your database. Each changeSet has an `id` and `author` that uniquely identifies it within a changelog file. Here are a few examples of different types of changes that you can represent in a changeSet:

**1 Creating a table**
```xml
<changeSet id="1" author="yourname">
    <createTable tableName="new_table">
        <column name="column1" type="varchar(255)"/>
    </createTable>
</changeSet>
``` 

**2 Adding a column**
```xml
<changeSet id="2" author="yourname">
    <addColumn tableName="existing_table">
        <column name="new_column" type="varchar(255)"/>
    </addColumn>
</changeSet>
```

**3 Dropping a column**
```xml
<changeSet id="3" author="yourname">
    <dropColumn tableName="existing_table" columnName="column_to_drop"/>
</changeSet>
```

**4 Modifying data**
```xml
<changeSet id="4" author="yourname">
    <update tableName="existing_table">
        <column name="column_to_update" value="new_value"/>
        <where>other_column = 'some_value'</where>
    </update>
</changeSet>
```

**5 Creating an index**
```xml
<changeSet id="5" author="yourname">
    <createIndex indexName="new_index" tableName="existing_table">
        <column name="column_to_index"/>
    </createIndex>
</changeSet>
```

**6 Dropping an index**
```xml
<changeSet id="6" author="yourname">
    <dropIndex indexName="existing_index" tableName="existing_table"/>
</changeSet>
```

**7 Adding a foreign key constraint**

```xml
<changeSet id="7" author="yourname">
    <addForeignKeyConstraint constraintName="fk_constraint"
                             baseTableName="table1" baseColumnNames="column1"
                             referencedTableName="table2" referencedColumnNames="column2"/>
</changeSet>
```
**8 Dropping a foreign key constraint**
```xml
<changeSet id="8" author="yourname">
    <dropForeignKeyConstraint constraintName="fk_constraint" baseTableName="table1"/>
</changeSet>
```

These are just a few examples of the kinds of changes that you can define in a changeSet. The full list of changes that Liquibase supports can be found in the Liquibase documentation.

Note that you can also define a preConditions on a changeSet, which are conditions that must be met in order for the changeSet to be executed. If the preConditions are not met, you can specify whether Liquibase should mark the changeSet as ran, fail the update, or just skip the changeSet.

Here is an example where a changeSet only runs if the new_table does not already exist:

```xml
<changeSet id="9" author="yourname">
    <preConditions onFail="MARK_RAN">
        <not>
            <tableExists tableName="new_table"/>
        </not>
    </preConditions>
    <createTable tableName="new_table">
        <column name="column1" type="varchar(255)"/>
    </createTable>
</changeSet>
```

In the above example, if new_table already exists, the changeSet is marked as ran and no error is thrown.

Remember that the specific SQL generated for a changeSet depends on your database type, as different databases have different SQL syntax. Liquibase handles this for you, ensuring that the correct SQL is generated for your database.

## How to get history of updates from liquibase

Liquibase tracks the history of updates that have been made to your database through a table named `DATABASECHANGELOG.` This table is created automatically in your database when Liquibase runs an update for the first time.

The `DATABASECHANGELOG` table contains the following columns:

`ID:` corresponds to the id attribute of the changeSet.

`AUTHOR:` corresponds to the author attribute of the changeSet.

`FILENAME:` the path of the changelog file that contains the changeSet.

`DATEEXECUTED:` the timestamp of when the changeSet was executed.

`ORDEREXECUTED:` the order in which the changeSet was executed, relative to all other changeSets.

`EXECTYPE:` the type of execution that was performed (e.g., EXECUTED, FAILED, etc.)

`MD5SUM:` a checksum for the changeSet, used to detect changes to the changeSet.

`DESCRIPTION:` a brief description of the changes made in the changeSet.

`COMMENTS:` any comments specified in the changeSet.

`TAG:` the tag specified for the changeSet (if any).

`LIQUIBASE:` the version of Liquibase that executed the changeSet.

`CONTEXTS:` the context in which the changeSet was executed.

`LABELS:` the labels associated with the changeSet.

`DEPLOYMENT_ID:` a unique identifier for the deployment.

You can query this table just like you would query any other table in your database to get the history of database updates. For example, you can execute a SQL query like this to get all updates:

```sql
SELECT * FROM DATABASECHANGELOG ORDER BY DATEEXECUTED DESC;
```

You can also use the history command provided by Liquibase to get the changeset history. Run the command from your terminal:
    
```bash 
    liquibase history
```
This command will give you a list of changesets that have been executed, along with when they were executed.