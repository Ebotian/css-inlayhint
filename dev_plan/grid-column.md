

    Skip to main content
    Skip to search

Blog
Log in

    Web
    CSS
    Reference
    Properties
    grid-column

grid-column
Baseline Widely available

This feature is well established and works across many devices and browser versions. It’s been available across browsers since October 2017.

    Learn more
    See full compatibility
    Report feedback

The grid-column CSS shorthand property specifies a grid item's size and location within a grid column by contributing a line, a span, or nothing (automatic) to its grid placement, thereby specifying the inline-start and inline-end edge of its grid area.
In this article

    Try it
    Constituent properties
    Syntax
    Formal definition
    Formal syntax
    Examples
    Specifications
    Browser compatibility
    See also

Try it
CSS Demo: grid-column

    grid-column: 1;
    grid-column: 1 / 3;
    grid-column: 2 / -1;
    grid-column: 1 / span 2;

Constituent properties

This property is a shorthand for the following CSS properties:

    grid-column-end
    grid-column-start

Syntax
css

/* Keyword values */
grid-column: auto;
grid-column: auto / auto;

/* <custom-ident> values */
grid-column: some-grid-area;
grid-column: some-grid-area / some-other-grid-area;

/* <integer> + <custom-ident> values */
grid-column: some-grid-area 4;
grid-column: 4 some-grid-area / 6;

/* span + <integer> + <custom-ident> values */
grid-column: span 3;
grid-column: span some-grid-area;
grid-column: 5 some-grid-area span;
grid-column: span 3 / 6;
grid-column: span some-grid-area / span some-other-grid-area;
grid-column: 5 some-grid-area span / 2 span;

/* Global values */
grid-column: inherit;
grid-column: initial;
grid-column: revert;
grid-column: revert-layer;
grid-column: unset;

This property is specified as one or two <grid-line> values.

If two <grid-line> values are given, they are separated by /. The grid-column-start longhand is set to the value before the slash, and the grid-column-end longhand is set to the value after the slash.

Each <grid-line> value can be specified as:

    either the auto keyword
    or a <custom-ident> value
    or an <integer> value
    or both <custom-ident> and <integer>, separated by a space
    or the keyword span together with either a <custom-ident> or an <integer> or both.

Values

auto

    Is a keyword indicating that the property contributes nothing to the grid item's placement, indicating auto-placement, an automatic span, or a default span of 1.
<custom-ident>

    If there is a named line with the name <custom-ident>-start/<custom-ident>-end, it contributes the first such line to the grid item's placement.

    Note: Named grid areas automatically generate implicit named lines of this form, so specifying grid-column: foo; will choose the start/end edge of that named grid area (unless another line named foo-start/foo-end was explicitly specified before it).

    Otherwise, this is treated as if the integer 1 had been specified along with the <custom-ident>.
<integer> && <custom-ident>?

    Contributes the nth grid line to the grid item's placement. If a negative integer is given, it instead counts in reverse, starting from the end edge of the explicit grid.

    If a name is given as a <custom-ident>, only lines with that name are counted. If not enough lines with that name exist, all implicit grid lines are assumed to have that name for the purpose of finding this position.

    An <integer> value of 0 is invalid.
span && [ <integer> || <custom-ident> ]

    Contributes a grid span to the grid item's placement such that the corresponding edge of the grid item's grid area is n lines from the opposite edge.

    If a name is given as a <custom-ident>, only lines with that name are counted. If not enough lines with that name exist, all implicit grid lines on the side of the explicit grid corresponding to the search direction are assumed to have that name for the purpose of counting this span.

    If the <integer> is omitted, it defaults to 1. Negative integers or 0 are invalid.

Formal definition
Initial value	as each of the properties of the shorthand:

    grid-column-start: auto
    grid-column-end: auto

Applies to	grid items and absolutely-positioned boxes whose containing block is a grid container
Inherited	no
Computed value	as each of the properties of the shorthand:

    grid-column-start: as specified
    grid-column-end: as specified

Animation type	discrete
Formal syntax

grid-column = 
  <grid-line> [ / <grid-line> ]?  

<grid-line> = 
  auto                                                |
  <custom-ident>                                      |
  [ [ <integer [-∞,-1]> | <integer [1,∞]> ] && <custom-ident>? ]  |
  [ span && [ <integer [1,∞]> || <custom-ident> ] ]   

<integer> = 
  <number-token>  

This syntax reflects the latest standard as per CSS Grid Layout Module Level 2, CSS Values and Units Module Level 4. Not all browsers may have implemented every part. See Browser compatibility for support information.
Examples
Setting grid column size and location
HTML
html
Play

<div id="grid">
  <div id="item1"></div>
  <div id="item2"></div>
  <div id="item3"></div>
</div>

CSS
css
Play

#grid {
  display: grid;
  height: 100px;
  grid-template-columns: repeat(6, 1fr);
  grid-template-rows: 100px;
}

#item1 {
  background-color: lime;
}

#item2 {
  background-color: yellow;
  grid-column: 2 / 4;
}

#item3 {
  background-color: blue;
  grid-column: span 2 / 7;
}

Result
Play
Specifications
Specification
CSS Grid Layout Module Level 2
# placement-shorthands
Browser compatibility
Report problems with this compatibility data • View data on GitHub
	desktop
	mobile
	
Chrome
	
Edge
	
Firefox
	
Opera
	
Safari
	
Chrome Android
	
Firefox for Android
	
Opera Android
	
Safari on iOS
	
Samsung Internet
	
WebView Android
	
WebView on iOS
grid-column
												
auto
												
Legend

Tip: you can click/tap on a cell for more information.

Full support
    Full support

See also

    grid-row
    grid-row-start
    grid-row-end
    grid-column-start
    grid-column-end

    Line-based placement with CSS grid

    Video: Line-based placement

Help improve MDN
Was this page helpful to you?
Learn how to contribute

This page was last modified on Dec 5, 2025 by MDN contributors.
View this page on GitHub • Report a problem with this content
Filter sidebar

    CSS
    Guides
    Modules
    Anchor positioning
    Animations
    Backgrounds and borders
    Box alignment
    Box model
    Box sizing
    Cascade
    Cascading variables
    Colors
    Columns
    Conditional rules
    Containment
    Counters
    CSSOM view
    Custom functions and mixins
    Display
    Environment variables
    Filter effects
    Flexbox
    Fonts
    Grid
    Images
    Lists
    Logical properties
    Masking
    Media queries
    Nesting
    Overflow
    Positioning
    Properties and Values API
    Scroll anchoring
    Scroll-driven animations
    Scroll snap
    Selectors
    Shapes
    Syntax
    Text
    Text decoration
    Transforms
    Transitions
    Values and units
    Writing modes
    How to
    Layout cookbook
    Tools
        Border-image generator
        Border-radius generator
        Box-shadow generator
        Color format converter
        Color mixer
        Shape generator
    Reference
    Properties
        -moz-*
        -webkit-*
        Custom properties (--*): CSS variables
        accent-color
        align-*
        alignment-baseline
        all
        anchor-name
        anchor-scope
        animation-*
        appearance
        aspect-ratio
        backdrop-filter
        backface-visibility
        background-*
        baseline-shift
        baseline-source
        block-size
        border-*
        bottom
        box-*
        break-*
        caption-side
        caret-*
        clear
        clip-*
        color-*
        column-*
        columns
        contain-*
        container-*
        content
        content-visibility
        corner-*
        counter-*
        cursor
        cx
        cy
        d
        direction
        display
        dominant-baseline
        dynamic-range-limit
        empty-cells
        field-sizing
        fill-*
        filter
        flex-*
        float
        flood-color
        flood-opacity
        font-*
        forced-color-adjust
        gap
        grid-*
            grid
            grid-area
            grid-auto-columns
            grid-auto-flow
            grid-auto-rows
            grid-column
            grid-column-end
            grid-column-start
            grid-row
            grid-row-end
            grid-row-start
            grid-template
            grid-template-areas
            grid-template-columns
            grid-template-rows
        hanging-punctuation
        height
        hyphenate-character
        hyphenate-limit-chars
        hyphens
        image-*
        initial-letter
        inline-size
        inset-*
        interactivity Experimental
        interest-*
        interpolate-size Experimental
        isolation
        justify-*
        left
        letter-spacing
        lighting-color
        line-*
        list-*
        margin-*
        marker-*
        mask-*
        math-*
        max-*
        min-*
        mix-blend-mode
        object-*
        offset-*
        opacity
        order
        orphans
        outline-*
        overflow-*
        overlay Experimental
        overscroll-*
        padding-*
        page-*
        paint-order
        perspective
        perspective-origin
        place-*
        pointer-events
        position-*
        print-color-adjust
        quotes
        r
        reading-flow Experimental
        reading-order Experimental
        resize
        right
        rotate
        row-gap
        ruby-*
        rx
        ry
        scale
        scroll-*
        scrollbar-*
        shape-*
        speak-as Experimental
        stop-color
        stop-opacity
        stroke-*
        tab-size
        table-layout
        text-*
        timeline-scope
        top
        touch-action
        transform-*
        transition-*
        translate
        unicode-bidi
        user-modify Non-standard Deprecated
        user-select
        vector-effect
        vertical-align
        view-*
        visibility
        white-space
        white-space-collapse
        widows
        width
        will-change
        word-break
        word-spacing
        writing-mode
        x
        y
        z-index
        zoom
    Selectors
    Combinators
    Pseudo-classes
    Pseudo-elements
    At-rules
    Values
    Types
    Functions

Your blueprint for a better internet.

MDN

        About
        Blog
        Mozilla careers
        Advertise with us
        MDN Plus
        Product help

Contribute

        MDN Community
        Community resources
        Writing guidelines
        MDN Discord
        MDN on GitHub

Developers

        Web technologies
        Learn web development
        Guides
        Tutorials
        Glossary
        Hacks blog

    Website Privacy Notice
    Telemetry Settings
    Legal
    Community Participation Guidelines

Visit Mozilla Corporation’s not-for-profit parent, the Mozilla Foundation.
Portions of this content are ©1998–2026 by individual mozilla.org contributors. Content available under a Creative Commons license.
