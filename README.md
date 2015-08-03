# Table #

Table FieldType for ExpressionEngine (Beta). *Note*; this add on is used in production on several websites but I'm not providing support for it (for now). If you need anything you can always [ask me on Twitter](https://twitter.com/bjornbjorn) though.

![Example table](http://i.imgur.com/943OVmY.png "Table Fieldtype")

## Available Cell Types

* Image
* Text
* Title + Image

Note; the Image field will use _Assets_ if it is installed, or the regular ExpressionEngine File filetype if not.

## Tags

### Field parameters

* row_limit: Maximum number of rows to return
* row_offset: Start at row X
* col_limit: Maximum number of cols to return
* col_offset: Start at col X

### Field tags

#### {table:rows}
	
{table:rows} will iterate all rows in the table with
	
* {table:row:num}: the current row number
* {table:row:total_cols}: column count in this row
* {table:row:type}: the type of this row
* {table:col}: a loop with all cols in this row

#### {table:col}
	
{table:col} will iterate all columns in the current row
	
* {table:col:num}: the current column number
* {table:col:content}: html for the current col
* {table:col:content_raw}: database content for the current row
* {table:col:content:num_words}: number of words in row (applies if text)
* {table:col:content:num_chars}: number of characters in row (applies if text)

### Example

Example template for field named "page_table":

```html
{if page_table}
    {page_table}
        <table>
            {table:rows}
            <tr class="kundeflater-row-{table:row:type}">
                {table:col}
                <td class="col{table:col:num}{if table:col:content:num_words > 1} col-left-align{/if}">{table:col:content}</td>
                {/table:col}
            </tr>
            {/table:rows}
        </table>
    {page_table}
{/if}
```

## Database format

The fieldtype stores the data in a format which should be pretty easy to get data from should you need it;

* Each field will get its own table named "exp_table_yourfieldname"
* Each row is a row in the database table
* Each column is a col in the database table

Example table:

```
+----------------+----------+-----+-------------+-------------------+-------------------+--------------------------------------+-------+-------+
| table_table_id | entry_id | row | row_type    | col_1             | col_2             | col_3                                | col_4 | col_5 |
+----------------+----------+-----+-------------+-------------------+-------------------+--------------------------------------+-------+-------+
|              4 |       32 |   2 | title_image | {"title_text":""} | {"title_text":""} | {"assets_file_id":2,"title_text":""} | NULL  | NULL  |
|              3 |       32 |   1 | text        | This              | Hello             | is                                   | NULL  | NULL  |
+----------------+----------+-----+-------------+-------------------+-------------------+--------------------------------------+-------+-------+
```


## Changelog

* [CHANGELOG.md](./CHANGELOG.md)


