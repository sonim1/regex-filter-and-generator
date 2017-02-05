[![APM Version](https://img.shields.io/apm/v/regex-filter-and-generator.svg)](https://atom.io/packages/regex-filter-and-generator)

# regex-filter-and-generator package

This Regular expression filter search support


Regex Filter Toggle Using Ctrl+Alt+R

```
Windows : CTRL+ALT+R
OSX : CTRL+OPTION+R
```

## Regular Expression Search Filter

Support Regular Expression Search.

![enter image description here](https://media.giphy.com/media/26xBvhezsaxD990hW/source.gif)

## Regular Expression generator

There is a generator button at the bottom of the panel.

Useful regular expressions can be checked.

You can modify the regular expression in the InputBox.

![enter image description here](https://media.giphy.com/media/d3mmMrL4OW8xGEpi/source.gif)

- Email
- Hex Color value
- IPv4
- IPv6
- URL
- Positive Number
- Negative Number
- Number
- UserName
- Password
- Number & Alphabet
- Alphabet
- UUID
- Date:yyyy/MM/dd
    - ex1) 1989/02/25
    - ex2) 1989-02-25
    - ex3) 1989.02.25
    - ex4) 1989 02 25
- Date:MM/dd/yyyy
    - ex1) 02/25/1989
    - ex2) 02-25-1989
    - ex3) 02.25.1989
    - ex4) 02 25 1989
- Character Limit
    - 1-10



## Editing Tips

You can make changes to the generated regular expression

### 1. Please remove ^ for full text search
Character ^ matches the beginning of the line.
ex) `/^[\w]{1,10}/g` => `/[\w]{1,10}/g`

### 2. Change Limit
ex) `/[\w]{1,10}/g` => `/[\w]{3,5}/g`
