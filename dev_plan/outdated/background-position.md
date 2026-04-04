

    Skip to main content
    Skip to search

Blog
Log in

    Web
    CSS
    Reference
    Properties
    background-position

background-position
Baseline Widely available

This feature is well established and works across many devices and browser versions. It’s been available across browsers since July 2015.

    Learn more
    See full compatibility
    Report feedback

The background-position CSS property sets the initial position for each background image. The position is relative to the position layer set by background-origin.
In this article

    Try it
    Syntax
    Formal definition
    Formal syntax
    Examples
    Specifications
    Browser compatibility
    See also

Try it
CSS Demo: background-position

    background-position: top;
    background-position: left;
    background-position: center;
    background-position: 25% 75%;
    background-position: bottom 50px right 100px;
    background-position: right 35% bottom 45%;

Syntax
css

/* Keyword values */
background-position: top;
background-position: bottom;
background-position: left;
background-position: right;
background-position: center;

/* <percentage> values */
background-position: 25% 75%;

/* <length> values */
background-position: 0 0;
background-position: 1cm 2cm;
background-position: 10ch 8em;

/* Multiple images */
background-position:
  0 0,
  center;

/* Edge offsets values */
background-position: bottom 10px right 20px;
background-position: right 3em bottom 10px;
background-position: bottom 10px right;
background-position: top right 10px;

/* Global values */
background-position: inherit;
background-position: initial;
background-position: revert;
background-position: revert-layer;
background-position: unset;

The background-position property is specified as one or more <position> values, separated by commas.
Values

<position>

    A <position>. A position defines an x/y coordinate, to place an item relative to the edges of an element's box. It can be defined using one to four values. If two non-keyword values are used, the first value represents the horizontal position and the second represents the vertical position. If only one value is specified, the second value is assumed to be center. If three or four values are used, the length-percentage values are offsets for the preceding keyword value(s).

    1-value syntax: The value may be:

        The keyword value center, which centers the image.
        One of the keyword values top, left, bottom, or right. This specifies an edge against which to place the item. The other dimension is then set to 50%, so the item is placed in the middle of the edge specified.
        A <length> or <percentage>. This specifies the X coordinate relative to the left edge, with the Y coordinate set to 50%.

    2-value syntax: One value defines X and the other defines Y. Each value may be:

        One of the keyword values top, left, bottom, or right. If left or right is given, then this defines X and the other given value defines Y. If top or bottom is given, then this defines Y and the other value defines X.
        A <length> or <percentage>. If the other value is left or right, then this value defines Y, relative to the top edge. If the other value is top or bottom, then this value defines X, relative to the left edge. If both values are <length> or <percentage> values, then the first defines X and the second Y.
        Note that: If one value is top or bottom, then the other value may not be top or bottom. If one value is left or right, then the other value may not be left or right. This means, e.g., that top top and left right are not valid.
        Order: When pairing keywords, placement is not important as the browser can reorder it; the values top left and left top will yield the same result. When pairing <length> or <percentage> with a keyword, the placement is important: the value defining X should come first followed by Y, so for example the value right 20px is valid while 20px right is invalid. The values left 20% and 20% bottom are valid as X and Y values are clearly defined and the placement is correct.
        The default value is left top or 0% 0%.

    3-value syntax: Two values are keyword values, and the third is the offset for the preceding value:

        The first value is one of the keyword values top, left, bottom, right, or center. If left or right are given here, then this defines X. If top or bottom are given, then this defines Y and the other keyword value defines X.
        The <length> or <percentage> value, if it is the second value, is the offset for the first value. If it is the third value, it is the offset for the second value.
        The single length or percentage value is an offset for the keyword value that precedes it. The combination of one keyword with two <length> or <percentage> values is not valid.

    4-value syntax: The first and third values are keyword values defining X and Y. The second and fourth values are offsets for the preceding X and Y keyword values:

        The first and third values are equal to one of the keyword values top, left, bottom, or right. If left or right is given for the first value, then this defines X and the other value defines Y. If top or bottom is given for the first value, then this defines Y and the other keyword value defines X.
        The second and fourth values are <length> or <percentage> values. The second value is the offset for the first keyword. The fourth value is the offset for the second keyword.

Regarding Percentages

The percentage offset of the given background image's position is relative to the container. A value of 0% means that the left (or top) edge of the background image is aligned with the corresponding left (or top) edge of the container, or the 0% mark of the image will be on the 0% mark of the container. A value of 100% means that the right (or bottom) edge of the background image is aligned with the right (or bottom) edge of the container, or the 100% mark of the image will be on the 100% mark of the container. Thus a value of 50% horizontally or vertically centers the background image as the 50% of the image will be at the 50% mark of the container. Similarly, background-position: 25% 75% means the spot on the image that is 25% from the left and 75% from the top will be placed at the spot of the container that is 25% from the container's left and 75% from the container's top.

Essentially what happens is the background image dimension is subtracted from the corresponding container dimension, and then a percentage of the resulting value is used as the direct offset from the left (or top) edge.

(container width - image width) * (position x%) = (x offset value)
(container height - image height) * (position y%) = (y offset value)

Using the X axis for an example, let's say we have an image that is 300px wide and we are using it in a container that is 100px wide, with background-size set to auto:

100px - 300px = -200px (container & image difference)

So that with position percentages of -25%, 0%, 50%, 100%, 125%, we get these image-to-container edge offset values:

-200px * -25% = 50px
-200px * 0% = 0px
-200px * 50% = -100px
-200px * 100% = -200px
-200px * 125% = -250px

So with these resultant values for our example, the left edge of the image is offset from the left edge of the container by:

    + 50px (putting the left image edge in the center of the 100-pixel-wide container)
    0px (left image edge coincident with the left container edge)
    -100px (left image edge 100px to the left of the container, in this example that means the middle 100px image area is centered in the container)
    -200px (left image edge 200px to the left of the container, in this example that means the right image edge is coincident with the right container edge)
    -250px (left image edge 250px to the left of the container, in this example that puts the right edge of the 300px-wide image in the center of the container)

It's worth mentioning that if your background-size is equal to the container size for a given axis, then a percentage position for that axis will have no effect because the "container-image difference" will be zero. You will need to offset using absolute values.
Formal definition
Initial value	0% 0%
Applies to	all elements. It also applies to ::first-letter and ::first-line.
Inherited	no
Percentages	refer to the size of the background positioning area minus size of background image; size refers to the width for horizontal offsets and to the height for vertical offsets
Computed value	as each of the properties of the shorthand:

    background-position-x: A list, each item consisting of: an offset given as a combination of an absolute length and a percentage, plus an origin keyword
    background-position-y: A list, each item consisting of: an offset given as a combination of an absolute length and a percentage, plus an origin keyword

Animation type	a repeatable list
Formal syntax

background-position = 
  <bg-position>#  

<bg-position> = 
  <position>        |
  <position-three>  

<position> = 
  <position-one>   |
  <position-two>   |
  <position-four>  

<position-three> = 
  [ left | center | right ] && [ [ top | bottom ] <length-percentage> ]  |
  [ [ left | right ] <length-percentage> ] && [ top | center | bottom ]  

<position-one> = 
  left                 |
  center               |
  right                |
  top                  |
  bottom               |
  x-start              |
  x-end                |
  y-start              |
  y-end                |
  block-start          |
  block-end            |
  inline-start         |
  inline-end           |
  <length-percentage>  

<position-two> = 
  [ left | center | right | x-start | x-end ] && [ top | center | bottom | y-start | y-end ]  |
  [ left | center | right | x-start | x-end | <length-percentage> ] [ top | center | bottom | y-start | y-end | <length-percentage> ]  |
  [ block-start | center | block-end ] && [ inline-start | center | inline-end ]  |
  [ start | center | end ]{2}                         

<position-four> = 
  [ [ left | right | x-start | x-end ] <length-percentage> ] && [ [ top | bottom | y-start | y-end ] <length-percentage> ]  |
  [ [ block-start | block-end ] <length-percentage> ] && [ [ inline-start | inline-end ] <length-percentage> ]  |
  [ [ start | end ] <length-percentage> ]{2}          

<length-percentage> = 
  <length>      |
  <percentage>  

This syntax reflects the latest standard as per CSS Backgrounds Module Level 4, CSS Values and Units Module Level 4, CSS Values and Units Module Level 5. Not all browsers may have implemented every part. See Browser compatibility for support information.
Examples
Positioning background images

Each of these three examples uses the background property to create a yellow, rectangular element containing a star image. In each example, the star is in a different position. The third example illustrates how to specify positions for two different background images within one element.
HTML
html
Play

<div class="example-one">Example One</div>
<div class="example-two">Example Two</div>
<div class="example-three">Example Three</div>

CSS
css
Play

/* Shared among all <div>s */
div {
  background-color: #ffee99;
  background-repeat: no-repeat;
  width: 300px;
  height: 80px;
  margin-bottom: 12px;
}

/* These examples use the `background` shorthand property */
.example-one {
  background: url("star-transparent.gif") #ffee99 2.5cm bottom no-repeat;
}
.example-two {
  background: url("star-transparent.gif") #ffee99 left 4em bottom 1em no-repeat;
}

/* Multiple background images: Each image is matched with the
   corresponding position, from first specified to last. */
.example-three {
  background-image: url("star-transparent.gif"), url("cat-front.png");
  background-position:
    0px 0px,
    right 3em bottom 2em;
}

Result
Play
Specifications
Specification
CSS Backgrounds and Borders Module Level 3
# background-position
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
background-position
												
bottom
												
center
												
left
												
Multiple backgrounds
												
right
												
Side-relative values (such as bottom 10% right 20%)
												
top
												
x-end
Experimental
												
x-start
Experimental
												
y-end
Experimental
												
y-start
Experimental
												
Legend

Tip: you can click/tap on a cell for more information.

Full support
    Full support
No support
    No support
    Experimental. Expect behavior to change in the future.
    See implementation notes.

See also

    background-position-x
    background-position-y
    Using multiple backgrounds
    transform-origin

Help improve MDN
Was this page helpful to you?
Learn how to contribute

This page was last modified on Nov 7, 2025 by MDN contributors.
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
            background
            background-attachment
            background-blend-mode
            background-clip
            background-color
            background-image
            background-origin
            background-position
            background-position-x
            background-position-y
            background-repeat
            background-repeat-x Experimental
            background-repeat-y Experimental
            background-size
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
