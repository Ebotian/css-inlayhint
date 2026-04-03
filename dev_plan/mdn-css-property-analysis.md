# MDN CSS property analysis

- Total properties analyzed: 490
- Standard properties: 490
- Non-standard properties: 0

## Bucket summary

- generic-single: 93
- keyword-union: 119
- mixed: 159
- property-reference: 51
- reference-repeat: 14
- repeatable: 18
- shorthand-family: 36

## Top groups

- CSS Backgrounds and Borders: 60
- CSS Logical Properties and Values: 53
- Scalable Vector Graphics: 32
- CSS Scroll Snap: 25
- CSS Fonts: 24
- CSS Text: 22
- CSS Animations: 21
- CSS Basic User Interface: 19
- CSS Masking: 19
- CSS Box Sizing: 16
- CSS Grid Layout: 15
- CSS Positioned Layout: 15

## Shorthand families

| name | shorthandMembers | syntax | bucket | status |
| --- | --- | --- | --- | --- |
| animation | animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state | <single-animation># | shorthand-family | standard |
| background | background-image, background-position, background-size, background-repeat, background-origin, background-clip, background-attachment, background-color | <bg-layer>#? , <final-bg-layer> | shorthand-family | standard |
| font | font-style, font-variant, font-weight, font-stretch, font-size, line-height, font-family | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | standard |
| mask | mask-image, mask-mode, mask-position, mask-size, mask-repeat, mask-origin, mask-clip | <mask-layer># | shorthand-family | standard |
| grid | grid-template-rows, grid-template-columns, grid-template-areas, grid-auto-rows, grid-auto-columns, grid-auto-flow | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | standard |
| mask-border | mask-border-source, mask-border-slice, mask-border-width, mask-border-outset, mask-border-repeat, mask-border-mode | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | standard |
| border-image | border-image-source, border-image-slice, border-image-width, border-image-outset, border-image-repeat | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | standard |
| font-variant | font-variant-ligatures, font-variant-alternates, font-variant-caps, font-variant-numeric, font-variant-east-asian | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | standard |
| border-color | border-top-color, border-right-color, border-bottom-color, border-left-color | <color>{1,4} | shorthand-family | standard |
| border-radius | border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | standard |
| border-style | border-top-style, border-right-style, border-bottom-style, border-left-style | <line-style>{1,4} | shorthand-family | standard |
| border-width | border-top-width, border-right-width, border-bottom-width, border-left-width | <line-width>{1,4} | shorthand-family | standard |
| grid-area | grid-row-start, grid-column-start, grid-row-end, grid-column-end | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | standard |
| margin | margin-top, margin-right, margin-bottom, margin-left | <'margin-top'>{1,4} | shorthand-family | standard |
| padding | padding-top, padding-right, padding-bottom, padding-left | <'padding-top'>{1,4} | shorthand-family | standard |
| scroll-padding | scroll-padding-top, scroll-padding-right, scroll-padding-bottom, scroll-padding-left | [ auto \| <length-percentage> ]{1,4} | shorthand-family | standard |
| transition | transition-property, transition-duration, transition-timing-function, transition-delay | <single-transition># | shorthand-family | standard |
| border | border-width, border-style, border-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-bottom | border-bottom-width, border-bottom-style, border-bottom-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-left | border-left-width, border-left-style, border-left-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-right | border-right-width, border-right-style, border-right-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-top | border-top-width, border-top-style, border-top-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| column-rule | column-rule-width, column-rule-style, column-rule-color | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | standard |
| flex | flex-grow, flex-shrink, flex-basis | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | standard |
| grid-template | grid-template-rows, grid-template-columns, grid-template-areas | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | standard |
| list-style | list-style-type, list-style-position, list-style-image | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | standard |
| outline | outline-width, outline-style, outline-color | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | standard |
| text-decoration | text-decoration-line, text-decoration-style, text-decoration-color | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | standard |
| background-position | background-position-x, background-position-y | <bg-position># | shorthand-family | standard |
| columns | column-width, column-count | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | standard |
| flex-flow | flex-direction, flex-wrap | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | standard |
| grid-column | grid-column-start, grid-column-end | <grid-line> [ / <grid-line> ]? | shorthand-family | standard |
| grid-row | grid-row-start, grid-row-end | <grid-line> [ / <grid-line> ]? | shorthand-family | standard |
| scroll-padding-block | scroll-padding-block-start, scroll-padding-block-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard |
| scroll-padding-inline | scroll-padding-inline-start, scroll-padding-inline-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard |
| text-emphasis | text-emphasis-style, text-emphasis-color | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | standard |

## MDN-derived composite families

| name | familyMembers | syntax | bucket | status |
| --- | --- | --- | --- | --- |
| grid | grid-template-rows, grid-template-columns, grid-template-areas, grid-auto-rows, grid-auto-columns, grid-auto-flow, grid-column-gap, grid-row-gap, column-gap, row-gap | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | standard |
| animation | animation-name, animation-duration, animation-timing-function, animation-delay, animation-iteration-count, animation-direction, animation-fill-mode, animation-play-state, animation-timeline | <single-animation># | shorthand-family | standard |
| background | background-image, background-position, background-size, background-repeat, background-origin, background-clip, background-attachment, background-color | <bg-layer>#? , <final-bg-layer> | shorthand-family | standard |
| mask | mask-image, mask-mode, mask-repeat, mask-position, mask-clip, mask-origin, mask-size, mask-composite | <mask-layer># | shorthand-family | standard |
| font | font-style, font-variant, font-weight, font-stretch, font-size, line-height, font-family | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | standard |
| stroke | stroke-dasharray, stroke-dashoffset, stroke-linecap, stroke-linejoin, stroke-miterlimit, stroke-opacity, stroke-width | <paint> | generic-single | standard |
| mask-border | mask-border-mode, mask-border-outset, mask-border-repeat, mask-border-slice, mask-border-source, mask-border-width | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | standard |
| border-image | border-image-source, border-image-slice, border-image-width, border-image-outset, border-image-repeat | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | standard |
| offset | offset-position, offset-path, offset-distance, offset-anchor, offset-rotate | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | standard |
| transition | transition-delay, transition-duration, transition-property, transition-timing-function, transition-behavior | <single-transition># | shorthand-family | standard |
| border-block-start | border-width, border-style, color, border-block-start-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard |
| border-color | border-top-color, border-right-color, border-bottom-color, border-left-color | <color>{1,4} | shorthand-family | standard |
| border-inline-end | border-width, border-style, color, border-inline-end-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard |
| border-inline-start | border-width, border-style, color, border-inline-start-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard |
| border-radius | border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | shorthand-family | standard |
| border-style | border-top-style, border-right-style, border-bottom-style, border-left-style | <line-style>{1,4} | shorthand-family | standard |
| border-width | border-top-width, border-right-width, border-bottom-width, border-left-width | <line-width>{1,4} | shorthand-family | standard |
| corner-shape | corner-top-left-shape, corner-top-right-shape, corner-bottom-left-shape, corner-bottom-right-shape | <corner-shape-value>{1,4} | repeatable | standard |
| grid-area | grid-row-start, grid-column-start, grid-row-end, grid-column-end | <grid-line> [ / <grid-line> ]{0,3} | shorthand-family | standard |
| inset | top, bottom, left, right | <'top'>{1,4} | reference-repeat | standard |
| margin | margin-bottom, margin-left, margin-right, margin-top | <'margin-top'>{1,4} | shorthand-family | standard |
| padding | padding-bottom, padding-left, padding-right, padding-top | <'padding-top'>{1,4} | shorthand-family | standard |
| scroll-margin | scroll-margin-bottom, scroll-margin-left, scroll-margin-right, scroll-margin-top | <length>{1,4} | repeatable | standard |
| scroll-padding | scroll-padding-bottom, scroll-padding-left, scroll-padding-right, scroll-padding-top | [ auto \| <length-percentage> ]{1,4} | shorthand-family | standard |
| text-decoration | text-decoration-color, text-decoration-style, text-decoration-line, text-decoration-thickness | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | standard |
| timeline-trigger | timeline-trigger-name, timeline-trigger-source, timeline-trigger-range, timeline-trigger-exit-range | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | standard |
| border | border-width, border-style, border-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-block | border-block-width, border-block-style, border-block-color | <'border-block-start'> | property-reference | standard |
| border-block-end | border-top-width, border-top-style, border-top-color | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard |
| border-bottom | border-bottom-width, border-bottom-style, border-bottom-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-inline | border-inline-width, border-inline-style, border-inline-color | <'border-block-start'> | property-reference | standard |
| border-left | border-left-width, border-left-style, border-left-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-right | border-right-width, border-right-style, border-right-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| border-top | border-top-width, border-top-style, border-top-color | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard |
| caret | caret-color, caret-animation, caret-shape | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | standard |
| column-rule | column-rule-width, column-rule-style, column-rule-color | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | standard |
| columns | column-width, column-count, column-height | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | standard |
| flex | flex-grow, flex-shrink, flex-basis | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | standard |
| grid-template | grid-template-columns, grid-template-rows, grid-template-areas | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | standard |
| list-style | list-style-type, list-style-position, list-style-image | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | standard |
| marker | marker-start, marker-mid, marker-end | none \| <url> | mixed | standard |
| outline | outline-width, outline-style, outline-color | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | standard |
| -webkit-text-stroke | -webkit-text-stroke-width, -webkit-text-stroke-color | <length> \|\| <color> | mixed | standard |
| background-position | background-position-x, background-position-y | <bg-position># | shorthand-family | standard |
| contain-intrinsic-size | contain-intrinsic-width, contain-intrinsic-height | [ auto? [ none \| <length> ] ]{1,2} | mixed | standard |
| container | container-name, container-type | <'container-name'> [ / <'container-type'> ]? | property-reference | standard |
| corner-block-end-shape | corner-end-start-shape, corner-end-end-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-block-start-shape | corner-start-start-shape, corner-start-end-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-bottom-shape | corner-bottom-left-shape, corner-bottom-right-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-inline-end-shape | corner-start-end-shape, corner-end-end-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-inline-start-shape | corner-start-start-shape, corner-start-end-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-left-shape | corner-top-left-shape, corner-bottom-left-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-right-shape | corner-top-right-shape, corner-bottom-right-shape | <corner-shape-value>{1,2} | repeatable | standard |
| corner-top-shape | corner-top-left-shape, corner-top-right-shape | <corner-shape-value>{1,2} | repeatable | standard |
| flex-flow | flex-direction, flex-wrap | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | standard |
| gap | row-gap, column-gap | <'row-gap'> <'column-gap'>? | property-reference | standard |
| grid-column | grid-column-start, grid-column-end | <grid-line> [ / <grid-line> ]? | shorthand-family | standard |
| grid-row | grid-row-start, grid-row-end | <grid-line> [ / <grid-line> ]? | shorthand-family | standard |
| inset-block | inset-block-start, inset-block-end | <'top'>{1,2} | reference-repeat | standard |
| inset-inline | inset-inline-start, inset-inline-end | <'top'>{1,2} | reference-repeat | standard |
| interest-delay | interest-delay-start, interest-delay-end | <'interest-delay-start'>{1,2} | reference-repeat | standard |
| margin-block | margin-block-start, margin-block-end | <'margin-top'>{1,2} | reference-repeat | standard |
| margin-inline | margin-inline-start, margin-inline-end | <'margin-top'>{1,2} | reference-repeat | standard |
| overflow | overflow-x, overflow-y | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | standard |
| overscroll-behavior | overscroll-behavior-x, overscroll-behavior-y | [ contain \| none \| auto ]{1,2} | keyword-union | standard |
| padding-block | padding-block-start, padding-block-end | <'padding-top'>{1,2} | reference-repeat | standard |
| padding-inline | padding-inline-start, padding-inline-end | <'padding-top'>{1,2} | reference-repeat | standard |
| place-content | align-content, justify-content | <'align-content'> <'justify-content'>? | property-reference | standard |
| place-items | align-items, justify-items | <'align-items'> <'justify-items'>? | property-reference | standard |
| place-self | align-self, justify-self | <'align-self'> <'justify-self'>? | property-reference | standard |
| scroll-margin-block | scroll-margin-block-start, scroll-margin-block-end | <length>{1,2} | repeatable | standard |
| scroll-margin-inline | scroll-margin-inline-start, scroll-margin-inline-end | <length>{1,2} | repeatable | standard |
| scroll-padding-block | scroll-padding-block-start, scroll-padding-block-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard |
| scroll-padding-inline | scroll-padding-inline-start, scroll-padding-inline-end | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard |
| text-emphasis | text-emphasis-style, text-emphasis-color | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | standard |
| text-wrap | text-wrap-mode, text-wrap-style | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | standard |
| timeline-trigger-exit-range | timeline-trigger-exit-range-start, timeline-trigger-exit-range-end | [ <'timeline-trigger-exit-range-start'> <'timeline-trigger-exit-range-end'>? ]# | property-reference | standard |
| timeline-trigger-range | timeline-trigger-range-start, timeline-trigger-range-end | [ <'timeline-trigger-range-start'> <'timeline-trigger-range-end'>? ]# | property-reference | standard |

## Conservative classification

- safe: 7
- defer: 29
- suppress: 454

### Safe candidates

| name | syntax | shorthandMembers | bucket | status | conservativeReason |
| --- | --- | --- | --- | --- | --- |
| border-color | <color>{1,4} | border-top-color, border-right-color, border-bottom-color, border-left-color | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| border-radius | <length-percentage [0,∞]>{1,4} [ / <length-percentage [0,∞]>{1,4} ]? | border-top-left-radius, border-top-right-radius, border-bottom-right-radius, border-bottom-left-radius | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| border-style | <line-style>{1,4} | border-top-style, border-right-style, border-bottom-style, border-left-style | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| border-width | <line-width>{1,4} | border-top-width, border-right-width, border-bottom-width, border-left-width | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| grid-area | <grid-line> [ / <grid-line> ]{0,3} | grid-row-start, grid-column-start, grid-row-end, grid-column-end | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| margin | <'margin-top'>{1,4} | margin-top, margin-right, margin-bottom, margin-left | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |
| padding | <'padding-top'>{1,4} | padding-top, padding-right, padding-bottom, padding-left | shorthand-family | standard | shorthand with repeated-value syntax and no alternation; safe for a first-pass hint candidate |

### Deferred candidates

| name | syntax | bucket | status | conservativeReason |
| --- | --- | --- | --- | --- |
| animation | <single-animation># | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| background | <bg-layer>#? , <final-bg-layer> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| background-position | <bg-position># | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border-bottom | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border-image | <'border-image-source'> \|\| <'border-image-slice'> [ / <'border-image-width'> \| / <'border-image-width'>? / <'border-image-outset'> ]? \|\| <'border-image-repeat'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border-left | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border-right | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| border-top | <line-width> \|\| <line-style> \|\| <color> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| column-rule | <'column-rule-width'> \|\| <'column-rule-style'> \|\| <'column-rule-color'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| columns | [ <'column-width'> \|\| <'column-count'> ] [ / <'column-height'> ]? | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| flex | none \| [ <'flex-grow'> <'flex-shrink'>? \|\| <'flex-basis'> ] | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| flex-flow | <'flex-direction'> \|\| <'flex-wrap'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| font | [ [ <'font-style'> \|\| <font-variant-css2> \|\| <'font-weight'> \|\| <font-width-css3> ]? <'font-size'> [ / <'line-height'> ]? <'font-family'># ] \| <system-family-name> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| font-variant | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> \|\| stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) \|\| [ small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps ] \|\| <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero \|\| <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| grid | <'grid-template'> \| <'grid-template-rows'> / [ auto-flow && dense? ] <'grid-auto-columns'>? \| [ auto-flow && dense? ] <'grid-auto-rows'>? / <'grid-template-columns'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| grid-column | <grid-line> [ / <grid-line> ]? | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| grid-row | <grid-line> [ / <grid-line> ]? | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| grid-template | none \| [ <'grid-template-rows'> / <'grid-template-columns'> ] \| [ <line-names>? <string> <track-size>? <line-names>? ]+ [ / <explicit-track-list> ]? | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| list-style | <'list-style-type'> \|\| <'list-style-position'> \|\| <'list-style-image'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| mask | <mask-layer># | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| mask-border | <'mask-border-source'> \|\| <'mask-border-slice'> [ / <'mask-border-width'>? [ / <'mask-border-outset'> ]? ]? \|\| <'mask-border-repeat'> \|\| <'mask-border-mode'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| outline | <'outline-width'> \|\| <'outline-style'> \|\| <'outline-color'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding | [ auto \| <length-percentage> ]{1,4} | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding-block | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| scroll-padding-inline | [ auto \| <length-percentage> ]{1,2} | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| text-decoration | <'text-decoration-line'> \|\| <'text-decoration-style'> \|\| <'text-decoration-color'> \|\| <'text-decoration-thickness'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| text-emphasis | <'text-emphasis-style'> \|\| <'text-emphasis-color'> | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |
| transition | <single-transition># | shorthand-family | standard | recognized shorthand family, but the syntax is more complex than the conservative first-pass rule |

### Suppressed candidates

| name | syntax | bucket | status | conservativeReason |
| --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-line-clamp | none \| <integer> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-fill-color | <color> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke | <length> \|\| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke-color | <color> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| -webkit-text-stroke-width | <length> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| accent-color | auto \| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-composition | <single-animation-composition># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-delay | <time># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-direction | <single-animation-direction># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-name | [ none \| <keyframes-name> ]# | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-play-state | <single-animation-play-state># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-timing-function | <easing-function># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| aspect-ratio | auto \|\| <ratio> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| backdrop-filter | none \| <filter-value-list> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| backface-visibility | visible \| hidden | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-attachment | <attachment># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-blend-mode | <blend-mode># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-clip | <bg-clip># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-color | <color> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-image | <bg-image># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-origin | <visual-box># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-repeat | <repeat-style># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| background-size | <bg-size># | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| baseline-source | auto \| first \| last | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| block-size | <'width'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block | <'border-block-start'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-color | <'border-top-color'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-end-color | <'border-top-color'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-end-style | <'border-top-style'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-end-width | <'border-top-width'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-start-color | <'border-top-color'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-start-style | <'border-top-style'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-start-width | <'border-top-width'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-style | <'border-top-style'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-block-width | <'border-top-width'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-color | <'border-top-color'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-style | <line-style> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-bottom-width | <line-width> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-collapse | separate \| collapse | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-end-end-radius | <'border-top-left-radius'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-end-start-radius | <'border-top-left-radius'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-source | none \| <image> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline | <'border-block-start'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-color | <'border-top-color'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-end-color | <'border-top-color'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-end-style | <'border-top-style'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-end-width | <'border-top-width'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-start-color | <'border-top-color'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-start-style | <'border-top-style'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-start-width | <'border-top-width'> | property-reference | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-style | <'border-top-style'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-inline-width | <'border-top-width'>{1,2} | reference-repeat | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-color | <color> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-style | <line-style> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-left-width | <line-width> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |
| border-right-color | <color> | generic-single | standard | no conservative semantic gain yet; keep it out of the first-pass hint set |

## Generic single-token candidates

| name | syntax | bucket | status | groups |
| --- | --- | --- | --- | --- |
| --* | <declaration-value> | generic-single | standard | CSS Custom Properties for Cascading Variables |
| -webkit-text-fill-color | <color> | generic-single | standard | WebKit Extensions |
| -webkit-text-stroke-color | <color> | generic-single | standard | WebKit Extensions |
| -webkit-text-stroke-width | <length> | generic-single | standard | WebKit Extensions |
| animation-composition | <single-animation-composition># | generic-single | standard | CSS Animations |
| animation-delay | <time># | generic-single | standard | CSS Animations |
| animation-direction | <single-animation-direction># | generic-single | standard | CSS Animations |
| animation-fill-mode | <single-animation-fill-mode># | generic-single | standard | CSS Animations |
| animation-iteration-count | <single-animation-iteration-count># | generic-single | standard | CSS Animations |
| animation-play-state | <single-animation-play-state># | generic-single | standard | CSS Animations |
| animation-timing-function | <easing-function># | generic-single | standard | CSS Animations |
| background-attachment | <attachment># | generic-single | standard | CSS Backgrounds and Borders |
| background-blend-mode | <blend-mode># | generic-single | standard | Compositing and Blending |
| background-clip | <bg-clip># | generic-single | standard | CSS Backgrounds and Borders |
| background-color | <color> | generic-single | standard | CSS Backgrounds and Borders |
| background-image | <bg-image># | generic-single | standard | CSS Backgrounds and Borders |
| background-origin | <visual-box># | generic-single | standard | CSS Backgrounds and Borders |
| background-repeat | <repeat-style># | generic-single | standard | CSS Backgrounds and Borders |
| background-size | <bg-size># | generic-single | standard | CSS Backgrounds and Borders |
| border-bottom-style | <line-style> | generic-single | standard | CSS Backgrounds and Borders |
| border-bottom-width | <line-width> | generic-single | standard | CSS Backgrounds and Borders |
| border-left-color | <color> | generic-single | standard | CSS Backgrounds and Borders |
| border-left-style | <line-style> | generic-single | standard | CSS Backgrounds and Borders |
| border-left-width | <line-width> | generic-single | standard | CSS Backgrounds and Borders |
| border-right-color | <color> | generic-single | standard | CSS Backgrounds and Borders |
| border-right-style | <line-style> | generic-single | standard | CSS Backgrounds and Borders |
| border-right-width | <line-width> | generic-single | standard | CSS Backgrounds and Borders |
| border-top-color | <color> | generic-single | standard | CSS Backgrounds and Borders |
| border-top-style | <line-style> | generic-single | standard | CSS Backgrounds and Borders |
| border-top-width | <line-width> | generic-single | standard | CSS Backgrounds and Borders |
| color | <color> | generic-single | standard | CSS Color |
| column-rule-color | <color> | generic-single | standard | CSS Multi-column Layout |
| corner-bottom-left-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-bottom-right-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-end-end-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-end-start-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-start-end-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-start-start-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-top-left-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| corner-top-right-shape | <corner-shape-value> | generic-single | standard | CSS Backgrounds and Borders |
| cursor | [ [ <url> [ <x> <y> ]? , ]* <cursor-predefined> ] | generic-single | standard | CSS Basic User Interface |
| fill | <paint> | generic-single | standard | Scalable Vector Graphics |
| flex-grow | <number> | generic-single | standard | CSS Flexible Box Layout |
| flex-shrink | <number> | generic-single | standard | CSS Flexible Box Layout |
| flood-color | <color> | generic-single | standard | Filter Effects |
| grid-auto-columns | <track-size>+ | generic-single | standard | CSS Grid Layout |
| grid-auto-rows | <track-size>+ | generic-single | standard | CSS Grid Layout |
| grid-column-end | <grid-line> | generic-single | standard | CSS Grid Layout |
| grid-column-start | <grid-line> | generic-single | standard | CSS Grid Layout |
| grid-row-end | <grid-line> | generic-single | standard | CSS Grid Layout |
| grid-row-start | <grid-line> | generic-single | standard | CSS Grid Layout |
| lighting-color | <color> | generic-single | standard | Filter Effects |
| mask-composite | <compositing-operator># | generic-single | standard | CSS Masking |
| mask-image | <mask-reference># | generic-single | standard | CSS Masking |
| mask-mode | <masking-mode># | generic-single | standard | CSS Masking |
| mask-origin | <coord-box># | generic-single | standard | CSS Masking |
| mask-position | <position># | generic-single | standard | CSS Masking |
| mask-repeat | <repeat-style># | generic-single | standard | CSS Masking |
| mask-size | <bg-size># | generic-single | standard | CSS Masking |
| object-position | <position> | generic-single | standard | CSS Images |
| offset-distance | <length-percentage> | generic-single | standard | Motion Path |
| opacity | <opacity-value> | generic-single | standard | CSS Color |
| order | <integer> | generic-single | standard | CSS Display |
| orphans | <integer> | generic-single | standard | CSS Fragmentation |
| outline-offset | <length> | generic-single | standard | CSS Basic User Interface |
| outline-width | <line-width> | generic-single | standard | CSS Basic User Interface |
| padding-bottom | <length-percentage [0,∞]> | generic-single | standard | CSS Box Model |
| padding-left | <length-percentage [0,∞]> | generic-single | standard | CSS Box Model |
| padding-right | <length-percentage [0,∞]> | generic-single | standard | CSS Box Model |
| padding-top | <length-percentage [0,∞]> | generic-single | standard | CSS Box Model |
| perspective-origin | <position> | generic-single | standard | CSS Transforms |
| reading-order | <integer> | generic-single | standard | CSS Display |
| scroll-margin-block-end | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-block-start | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-bottom | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-inline-end | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-inline-start | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-left | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-right | <length> | generic-single | standard | CSS Scroll Snap |
| scroll-margin-top | <length> | generic-single | standard | CSS Scroll Snap |
| shape-image-threshold | <opacity-value> | generic-single | standard | CSS Shapes |
| shape-margin | <length-percentage> | generic-single | standard | CSS Shapes |
| stroke | <paint> | generic-single | standard | Scalable Vector Graphics |
| stroke-miterlimit | <number> | generic-single | standard | Scalable Vector Graphics |
| text-decoration-color | <color> | generic-single | standard | CSS Text Decoration |
| text-emphasis-color | <color> | generic-single | standard | CSS Text Decoration |
| text-indent | <length-percentage> && hanging? && each-line? | generic-single | standard | CSS Text |
| timeline-trigger-source | <single-animation-timeline># | generic-single | standard | CSS Animations |
| transition-behavior | <transition-behavior-value># | generic-single | standard | CSS Transitions |
| transition-delay | <time># | generic-single | standard | CSS Transitions |
| transition-duration | <time># | generic-single | standard | CSS Transitions |
| transition-timing-function | <easing-function># | generic-single | standard | CSS Transitions |
| widows | <integer> | generic-single | standard | CSS Fragmentation |

## Keyword unions

| name | syntax | bucket | status | groups |
| --- | --- | --- | --- | --- |
| alignment-baseline | baseline \| alphabetic \| ideographic \| middle \| central \| mathematical \| text-before-edge \| text-after-edge | keyword-union | standard | CSS Inline |
| all | initial \| inherit \| unset \| revert \| revert-layer | keyword-union | standard | CSS Cascading and Inheritance |
| backface-visibility | visible \| hidden | keyword-union | standard | CSS Transforms |
| baseline-source | auto \| first \| last | keyword-union | standard | CSS Inline |
| border-collapse | separate \| collapse | keyword-union | standard | CSS Table |
| border-image-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | standard | CSS Backgrounds and Borders |
| box-decoration-break | slice \| clone | keyword-union | standard | CSS Fragmentation |
| box-sizing | content-box \| border-box | keyword-union | standard | CSS Box Sizing |
| break-after | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | standard | CSS Fragmentation |
| break-before | auto \| avoid \| always \| all \| avoid-page \| page \| left \| right \| recto \| verso \| avoid-column \| column \| avoid-region \| region | keyword-union | standard | CSS Fragmentation |
| break-inside | auto \| avoid \| avoid-page \| avoid-column \| avoid-region | keyword-union | standard | CSS Fragmentation |
| caption-side | top \| bottom | keyword-union | standard | CSS Table |
| caret | <'caret-color'> \|\| <'caret-animation'> \|\| <'caret-shape'> | keyword-union | standard | CSS Basic User Interface |
| caret-animation | auto \| manual | keyword-union | standard | CSS Basic User Interface |
| caret-shape | auto \| bar \| block \| underscore | keyword-union | standard | CSS Basic User Interface |
| clear | none \| left \| right \| both \| inline-start \| inline-end | keyword-union | standard | CSS Positioned Layout |
| clip-rule | nonzero \| evenodd | keyword-union | standard | CSS Masking |
| color-interpolation-filters | auto \| sRGB \| linearRGB | keyword-union | standard | Filter Effects |
| column-fill | auto \| balance | keyword-union | standard | CSS Multi-column Layout |
| column-span | none \| all | keyword-union | standard | CSS Multi-column Layout |
| column-wrap | auto \| nowrap \| wrap | keyword-union | standard | CSS Box Sizing, CSS Multi-column Layout |
| contain | none \| strict \| content \| [ [ size \|\| inline-size ] \|\| layout \|\| style \|\| paint ] | keyword-union | standard | CSS Containment |
| container-type | normal \| [ [ size \| inline-size ] \|\| scroll-state ] | keyword-union | standard | CSS Conditional Rules |
| content-visibility | visible \| auto \| hidden | keyword-union | standard | CSS Containment |
| direction | ltr \| rtl | keyword-union | standard | CSS Writing Modes |
| dominant-baseline | auto \| text-bottom \| alphabetic \| ideographic \| middle \| central \| mathematical \| hanging \| text-top | keyword-union | standard | CSS Inline, Scalable Vector Graphics |
| empty-cells | show \| hide | keyword-union | standard | CSS Table |
| fill-rule | nonzero \| evenodd | keyword-union | standard | Scalable Vector Graphics |
| flex-basis | content \| <'width'> | keyword-union | standard | CSS Flexible Box Layout |
| flex-direction | row \| row-reverse \| column \| column-reverse | keyword-union | standard | CSS Flexible Box Layout |
| flex-wrap | nowrap \| wrap \| wrap-reverse | keyword-union | standard | CSS Flexible Box Layout |
| float | left \| right \| none \| inline-start \| inline-end | keyword-union | standard | CSS Positioned Layout |
| font-kerning | auto \| normal \| none | keyword-union | standard | CSS Fonts |
| font-optical-sizing | auto \| none | keyword-union | standard | CSS Fonts |
| font-synthesis | none \| [ weight \|\| style \|\| small-caps \|\| position] | keyword-union | standard | CSS Fonts |
| font-synthesis-small-caps | auto \| none | keyword-union | standard | CSS Fonts |
| font-synthesis-style | auto \| none | keyword-union | standard | CSS Fonts |
| font-synthesis-weight | auto \| none | keyword-union | standard | CSS Fonts |
| font-variant-caps | normal \| small-caps \| all-small-caps \| petite-caps \| all-petite-caps \| unicase \| titling-caps | keyword-union | standard | CSS Fonts |
| font-variant-emoji | normal \| text \| emoji \| unicode | keyword-union | standard | CSS Fonts |
| font-variant-position | normal \| sub \| super | keyword-union | standard | CSS Fonts |
| forced-color-adjust | auto \| none \| preserve-parent-color | keyword-union | standard | CSS Color |
| grid-auto-flow | [ row \| column ] \|\| dense | keyword-union | standard | CSS Grid Layout |
| hanging-punctuation | none \| [ first \|\| [ force-end \| allow-end ] \|\| last ] | keyword-union | standard | CSS Text |
| hyphens | none \| manual \| auto | keyword-union | standard | CSS Text |
| image-rendering | auto \| crisp-edges \| pixelated \| smooth | keyword-union | standard | CSS Images |
| interactivity | auto \| inert | keyword-union | standard | CSS Basic User Interface |
| isolation | auto \| isolate | keyword-union | standard | Compositing and Blending |
| line-break | auto \| loose \| normal \| strict \| anywhere | keyword-union | standard | CSS Text |
| list-style-position | inside \| outside | keyword-union | standard | CSS Lists and Counters |
| mask-border-mode | luminance \| alpha | keyword-union | standard | CSS Masking |
| mask-border-repeat | [ stretch \| repeat \| round \| space ]{1,2} | keyword-union | standard | CSS Masking |
| mask-type | luminance \| alpha | keyword-union | standard | CSS Masking |
| math-style | normal \| compact | keyword-union | standard | MathML |
| object-fit | fill \| contain \| cover \| none \| scale-down | keyword-union | standard | CSS Images |
| offset | [ <'offset-position'>? [ <'offset-path'> [ <'offset-distance'> \|\| <'offset-rotate'> ]? ]? ]! [ / <'offset-anchor'> ]? | keyword-union | standard | Motion Path |
| overflow | [ visible \| hidden \| clip \| scroll \| auto ]{1,2} | keyword-union | standard | CSS Overflow |
| overflow-anchor | auto \| none | keyword-union | standard | CSS Scroll Anchoring |
| overflow-block | visible \| hidden \| clip \| scroll \| auto | keyword-union | standard | CSS Overflow |
| overflow-inline | visible \| hidden \| clip \| scroll \| auto | keyword-union | standard | CSS Overflow |
| overflow-wrap | normal \| break-word \| anywhere | keyword-union | standard | CSS Text |
| overflow-x | visible \| hidden \| clip \| scroll \| auto | keyword-union | standard | CSS Overflow |
| overflow-y | visible \| hidden \| clip \| scroll \| auto | keyword-union | standard | CSS Overflow |
| overscroll-behavior | [ contain \| none \| auto ]{1,2} | keyword-union | standard | CSS Overscroll Behavior |
| overscroll-behavior-block | contain \| none \| auto | keyword-union | standard | CSS Overscroll Behavior |
| overscroll-behavior-inline | contain \| none \| auto | keyword-union | standard | CSS Overscroll Behavior |
| overscroll-behavior-x | contain \| none \| auto | keyword-union | standard | CSS Overscroll Behavior |
| overscroll-behavior-y | contain \| none \| auto | keyword-union | standard | CSS Overscroll Behavior |
| paint-order | normal \| [ fill \|\| stroke \|\| markers ] | keyword-union | standard | Scalable Vector Graphics |
| pointer-events | auto \| none \| visiblePainted \| visibleFill \| visibleStroke \| visible \| painted \| fill \| stroke \| all \| inherit | keyword-union | standard | CSS Basic User Interface |
| position | static \| relative \| absolute \| sticky \| fixed | keyword-union | standard | CSS Positioned Layout |
| print-color-adjust | economy \| exact | keyword-union | standard | CSS Color |
| reading-flow | normal \| source-order \| flex-visual \| flex-flow \| grid-rows \| grid-columns \| grid-order | keyword-union | standard | CSS Display |
| resize | none \| both \| horizontal \| vertical \| block \| inline | keyword-union | standard | CSS Basic User Interface |
| ruby-align | start \| center \| space-between \| space-around | keyword-union | standard | CSS Ruby |
| ruby-overhang | auto \| none | keyword-union | standard | CSS Ruby |
| ruby-position | [ alternate \|\| [ over \| under ] ] \| inter-character | keyword-union | standard | CSS Ruby |
| scroll-behavior | auto \| smooth | keyword-union | standard | CSS Overflow |
| scroll-marker-group | none \| before \| after | keyword-union | standard | CSS Overflow |
| scroll-snap-align | [ none \| start \| end \| center ]{1,2} | keyword-union | standard | CSS Scroll Snap |
| scroll-snap-stop | normal \| always | keyword-union | standard | CSS Scroll Snap |
| scroll-snap-type | none \| [ x \| y \| block \| inline \| both ] [ mandatory \| proximity ]? | keyword-union | standard | CSS Scroll Snap |
| scroll-target-group | none \| auto | keyword-union | standard | CSS Overflow |
| scrollbar-gutter | auto \| stable && both-edges? | keyword-union | standard | CSS Overflow |
| scrollbar-width | auto \| thin \| none | keyword-union | standard | CSS Scrollbars Styling |
| shape-rendering | auto \| optimizeSpeed \| crispEdges \| geometricPrecision | keyword-union | standard | Scalable Vector Graphics |
| stroke-linecap | butt \| round \| square | keyword-union | standard | Scalable Vector Graphics |
| stroke-linejoin | miter \| miter-clip \| round \| bevel \| arcs | keyword-union | standard | Scalable Vector Graphics |
| table-layout | auto \| fixed | keyword-union | standard | CSS Table |
| text-align | start \| end \| left \| right \| center \| justify \| match-parent | keyword-union | standard | CSS Text |
| text-align-last | auto \| start \| end \| left \| right \| center \| justify | keyword-union | standard | CSS Text |
| text-anchor | start \| middle \| end | keyword-union | standard | Scalable Vector Graphics |
| text-box | normal \| <'text-box-trim'> \|\| <'text-box-edge'> | keyword-union | standard | CSS Inline |
| text-box-trim | none \| trim-start \| trim-end \| trim-both | keyword-union | standard | CSS Inline |
| text-decoration-line | none \| [ underline \|\| overline \|\| line-through \|\| blink ] \| spelling-error \| grammar-error | keyword-union | standard | CSS Text Decoration |
| text-decoration-skip-ink | auto \| all \| none | keyword-union | standard | CSS Text Decoration |
| text-decoration-style | solid \| double \| dotted \| dashed \| wavy | keyword-union | standard | CSS Text Decoration |
| text-emphasis-position | auto \| [ over \| under ] && [ right \| left ]? | keyword-union | standard | CSS Text Decoration |
| text-justify | auto \| inter-character \| inter-word \| none | keyword-union | standard | CSS Text |
| text-orientation | mixed \| upright \| sideways | keyword-union | standard | CSS Writing Modes |
| text-rendering | auto \| optimizeSpeed \| optimizeLegibility \| geometricPrecision | keyword-union | standard | Scalable Vector Graphics |
| text-transform | none \| [ capitalize \| uppercase \| lowercase ] \|\| full-width \|\| full-size-kana \| math-auto | keyword-union | standard | CSS Text, MathML |
| text-underline-position | auto \| from-font \| [ under \|\| [ left \| right ] ] | keyword-union | standard | CSS Text Decoration |
| text-wrap | <'text-wrap-mode'> \|\| <'text-wrap-style'> | keyword-union | standard | CSS Text |
| text-wrap-mode | wrap \| nowrap | keyword-union | standard | CSS Text |
| text-wrap-style | auto \| balance \| stable \| pretty | keyword-union | standard | CSS Text |
| timeline-trigger | none \| [ <'timeline-trigger-name'> <'timeline-trigger-source'> <'timeline-trigger-range'> [ '/' <'timeline-trigger-exit-range'> ]? ]# | keyword-union | standard | CSS Animations |
| touch-action | auto \| none \| [ [ pan-x \| pan-left \| pan-right ] \|\| [ pan-y \| pan-up \| pan-down ] \|\| pinch-zoom ] \| manipulation | keyword-union | standard | Pointer Events |
| transform-box | content-box \| border-box \| fill-box \| stroke-box \| view-box | keyword-union | standard | CSS Transforms |
| transform-style | flat \| preserve-3d | keyword-union | standard | CSS Transforms |
| unicode-bidi | normal \| embed \| isolate \| bidi-override \| isolate-override \| plaintext | keyword-union | standard | CSS Writing Modes |
| user-select | auto \| text \| none \| all | keyword-union | standard | CSS Basic User Interface |
| vector-effect | none \| non-scaling-stroke \| non-scaling-size \| non-rotation \| fixed-position | keyword-union | standard | Scalable Vector Graphics |
| visibility | visible \| hidden \| collapse | keyword-union | standard | CSS Display, Scalable Vector Graphics |
| white-space | normal \| pre \| pre-wrap \| pre-line \| <'white-space-collapse'> \|\| <'text-wrap-mode'> | keyword-union | standard | CSS Text |
| white-space-collapse | collapse \| preserve \| preserve-breaks \| preserve-spaces \| break-spaces | keyword-union | standard | CSS Text |
| word-break | normal \| break-all \| keep-all \| break-word \| auto-phrase | keyword-union | standard | CSS Text |
| word-wrap | normal \| break-word | keyword-union | standard | CSS Text |
| writing-mode | horizontal-tb \| vertical-rl \| vertical-lr \| sideways-rl \| sideways-lr | keyword-union | standard | CSS Writing Modes |

## Mixed syntax

| name | syntax | bucket | status | groups |
| --- | --- | --- | --- | --- |
| -webkit-line-clamp | none \| <integer> | mixed | standard | WebKit Extensions, CSS Overflow |
| -webkit-text-stroke | <length> \|\| <color> | mixed | standard | WebKit Extensions |
| accent-color | auto \| <color> | mixed | standard | CSS Basic User Interface |
| align-content | normal \| <baseline-position> \| <content-distribution> \| <overflow-position>? <content-position> | mixed | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-items | normal \| stretch \| <baseline-position> \| [ <overflow-position>? <self-position> ] \| anchor-center | mixed | standard | CSS Box Alignment, CSS Flexible Box Layout |
| align-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? <self-position> \| anchor-center | mixed | standard | CSS Box Alignment, CSS Flexible Box Layout |
| animation-duration | [ auto \| <time [0s,∞]> ]# | mixed | standard | CSS Animations |
| animation-name | [ none \| <keyframes-name> ]# | mixed | standard | CSS Animations |
| animation-trigger | [ none \| [ <dashed-ident> <animation-action>+ ]+ ]# | mixed | standard | CSS Animations |
| appearance | none \| auto \| <compat-auto> \| <compat-special> | mixed | standard | CSS Basic User Interface |
| aspect-ratio | auto \|\| <ratio> | mixed | standard | CSS Box Sizing |
| backdrop-filter | none \| <filter-value-list> | mixed | standard | Filter Effects |
| background-position-x | [ center \| [ [ left \| right \| x-start \| x-end ]? <length-percentage>? ]! ]# | mixed | standard | CSS Backgrounds and Borders |
| background-position-y | [ center \| [ [ top \| bottom \| y-start \| y-end ]? <length-percentage>? ]! ]# | mixed | standard | CSS Backgrounds and Borders |
| baseline-shift | <length-percentage> \| sub \| super \| baseline | mixed | standard | CSS Inline |
| border-block-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | CSS Logical Properties and Values |
| border-block-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | CSS Logical Properties and Values |
| border-image-outset | [ <length [0,∞]> \| <number [0,∞]> ]{1,4} | mixed | standard | CSS Backgrounds and Borders |
| border-image-slice | [ <number [0,∞]> \| <percentage [0,∞]> ]{1,4} && fill? | mixed | standard | CSS Backgrounds and Borders |
| border-image-source | none \| <image> | mixed | standard | CSS Backgrounds and Borders |
| border-image-width | [ <length-percentage [0,∞]> \| <number [0,∞]> \| auto ]{1,4} | mixed | standard | CSS Backgrounds and Borders |
| border-inline-end | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | CSS Logical Properties and Values |
| border-inline-start | <'border-top-width'> \|\| <'border-top-style'> \|\| <color> | mixed | standard | CSS Logical Properties and Values |
| bottom | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Positioned Layout |
| box-shadow | none \| <shadow># | mixed | standard | CSS Backgrounds and Borders |
| caret-color | auto \| <color> | mixed | standard | CSS Basic User Interface |
| clip-path | <clip-source> \| [ <basic-shape> \|\| <geometry-box> ] \| none | mixed | standard | CSS Masking |
| color-scheme | normal \| [ light \| dark \| <custom-ident> ]+ && only? | mixed | standard | CSS Color |
| column-count | <integer> \| auto | mixed | standard | CSS Multi-column Layout |
| column-gap | normal \| <length-percentage> | mixed | standard | CSS Box Alignment, CSS Multi-column Layout |
| column-height | auto \| <length [0,∞]> | mixed | standard | CSS Box Sizing, CSS Multi-column Layout |
| column-width | auto \| <length [0,∞]> | mixed | standard | CSS Box Sizing, CSS Multi-column Layout |
| contain-intrinsic-block-size | auto? [ none \| <length> ] | mixed | standard | CSS Box Sizing |
| contain-intrinsic-height | auto? [ none \| <length> ] | mixed | standard | CSS Box Sizing |
| contain-intrinsic-inline-size | auto? [ none \| <length> ] | mixed | standard | CSS Box Sizing |
| contain-intrinsic-size | [ auto? [ none \| <length> ] ]{1,2} | mixed | standard | CSS Box Sizing |
| contain-intrinsic-width | auto? [ none \| <length> ] | mixed | standard | CSS Box Sizing |
| container-name | none \| <custom-ident>+ | mixed | standard | CSS Conditional Rules |
| content | normal \| none \| [ <content-replacement> \| <content-list> ] [ / [ <string> \| <counter> \| <attr()> ]+ ]? | mixed | standard | CSS Generated Content |
| counter-increment | [ <counter-name> <integer>? ]+ \| none | mixed | standard | CSS Lists and Counters |
| counter-reset | [ <counter-name> <integer>? \| <reversed-counter-name> <integer>? ]+ \| none | mixed | standard | CSS Lists and Counters |
| counter-set | [ <counter-name> <integer>? ]+ \| none | mixed | standard | CSS Lists and Counters |
| cx | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| cy | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| d | none \| path(<string>) | mixed | standard | Scalable Vector Graphics |
| display | [ <display-outside> \|\| <display-inside> ] \| <display-listitem> \| <display-internal> \| <display-box> \| <display-legacy> | mixed | standard | CSS Display |
| dynamic-range-limit | standard \| no-limit \| constrained \| <dynamic-range-limit-mix()> | mixed | standard | CSS Color |
| filter | none \| <filter-value-list> | mixed | standard | Filter Effects |
| font-family | [ <family-name> \| <generic-family> ]# | mixed | standard | CSS Fonts |
| font-feature-settings | normal \| <feature-tag-value># | mixed | standard | CSS Fonts |
| font-language-override | normal \| <string> | mixed | standard | CSS Fonts |
| font-palette | normal \| light \| dark \| <palette-identifier> \| <palette-mix()> | mixed | standard | CSS Fonts |
| font-size | <absolute-size> \| <relative-size> \| <length-percentage [0,∞]> \| math | mixed | standard | CSS Fonts |
| font-size-adjust | none \| [ ex-height \| cap-height \| ch-width \| ic-width \| ic-height ]? [ from-font \| <number> ] | mixed | standard | CSS Fonts |
| font-style | normal \| italic \| oblique <angle>? | mixed | standard | CSS Fonts |
| font-variant-alternates | normal \| [ stylistic( <feature-value-name> ) \|\| historical-forms \|\| styleset( <feature-value-name># ) \|\| character-variant( <feature-value-name># ) \|\| swash( <feature-value-name> ) \|\| ornaments( <feature-value-name> ) \|\| annotation( <feature-value-name> ) ] | mixed | standard | CSS Fonts |
| font-variant-east-asian | normal \| [ <east-asian-variant-values> \|\| <east-asian-width-values> \|\| ruby ] | mixed | standard | CSS Fonts |
| font-variant-ligatures | normal \| none \| [ <common-lig-values> \|\| <discretionary-lig-values> \|\| <historical-lig-values> \|\| <contextual-alt-values> ] | mixed | standard | CSS Fonts |
| font-variant-numeric | normal \| [ <numeric-figure-values> \|\| <numeric-spacing-values> \|\| <numeric-fraction-values> \|\| ordinal \|\| slashed-zero ] | mixed | standard | CSS Fonts |
| font-variation-settings | normal \| [ <string> <number> ]# | mixed | standard | CSS Fonts |
| font-weight | <font-weight-absolute> \| bolder \| lighter | mixed | standard | CSS Fonts |
| grid-template-areas | none \| <string>+ | mixed | standard | CSS Grid Layout |
| grid-template-columns | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | standard | CSS Grid Layout |
| grid-template-rows | none \| <track-list> \| <auto-track-list> \| subgrid <line-name-list>? | mixed | standard | CSS Grid Layout |
| height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| hyphenate-character | auto \| <string> | mixed | standard | CSS Text |
| hyphenate-limit-chars | [ auto \| <integer> ]{1,3} | mixed | standard | CSS Text |
| image-orientation | from-image \| <angle> \| [ <angle>? flip ] | mixed | standard | CSS Images |
| initial-letter | normal \| [ <number> <integer>? ] | mixed | standard | CSS Inline |
| interest-delay-end | normal \| <time> | mixed | standard | CSS Basic User Interface |
| interest-delay-start | normal \| <time> | mixed | standard | CSS Basic User Interface |
| justify-content | normal \| <content-distribution> \| <overflow-position>? [ <content-position> \| left \| right ] | mixed | standard | CSS Box Alignment, CSS Flexible Box Layout |
| justify-items | normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| legacy \| legacy && [ left \| right \| center ] \| anchor-center | mixed | standard | CSS Box Alignment |
| justify-self | auto \| normal \| stretch \| <baseline-position> \| <overflow-position>? [ <self-position> \| left \| right ] \| anchor-center | mixed | standard | CSS Box Alignment |
| left | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Positioned Layout |
| letter-spacing | normal \| <length> | mixed | standard | CSS Text |
| line-clamp | none \| <integer> | mixed | standard | CSS Overflow |
| line-height | normal \| <number> \| <length> \| <percentage> | mixed | standard | CSS Inline |
| list-style-image | <image> \| none | mixed | standard | CSS Lists and Counters |
| list-style-type | <counter-style> \| <string> \| none | mixed | standard | CSS Lists and Counters |
| margin-bottom | <length-percentage> \| auto \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Box Model |
| margin-left | <length-percentage> \| auto \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Box Model |
| margin-right | <length-percentage> \| auto \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Box Model |
| margin-top | <length-percentage> \| auto \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Box Model |
| marker | none \| <url> | mixed | standard | Scalable Vector Graphics |
| marker-end | none \| <url> | mixed | standard | Scalable Vector Graphics |
| marker-mid | none \| <url> | mixed | standard | Scalable Vector Graphics |
| marker-start | none \| <url> | mixed | standard | Scalable Vector Graphics |
| mask-border-outset | [ <length> \| <number> ]{1,4} | mixed | standard | CSS Masking |
| mask-border-source | none \| <image> | mixed | standard | CSS Masking |
| mask-border-width | [ <length-percentage> \| <number> \| auto ]{1,4} | mixed | standard | CSS Masking |
| mask-clip | [ <coord-box> \| no-clip ]# | mixed | standard | CSS Masking |
| math-depth | auto-add \| add(<integer>) \| <integer> | mixed | standard | MathML |
| max-height | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| max-width | none \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| min-height | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| min-width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| mix-blend-mode | <blend-mode> \| plus-darker \| plus-lighter | mixed | standard | Compositing and Blending |
| offset-anchor | auto \| <position> | mixed | standard | Motion Path |
| offset-path | none \| <offset-path> \|\| <coord-box> | mixed | standard | Motion Path |
| offset-position | normal \| auto \| <position> | mixed | standard | Motion Path |
| offset-rotate | [ auto \| reverse ] \|\| <angle> | mixed | standard | Motion Path |
| outline-color | auto \| <color> | mixed | standard | CSS Basic User Interface |
| outline-style | auto \| <outline-line-style> | mixed | standard | CSS Basic User Interface |
| overflow-clip-margin | <visual-box> \|\| <length [0,∞]> | mixed | standard | CSS Overflow |
| page | auto \| <custom-ident> | mixed | standard | CSS Paged Media |
| perspective | none \| <length> | mixed | standard | CSS Transforms |
| quotes | none \| auto \| [ <string> <string> ]+ | mixed | standard | CSS Generated Content |
| r | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| right | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Positioned Layout |
| rotate | none \| <angle> \| [ x \| y \| z \| <number>{3} ] && <angle> | mixed | standard | CSS Transforms |
| row-gap | normal \| <length-percentage> | mixed | standard | CSS Box Alignment |
| rx | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| ry | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| scale | none \| [ <number> \| <percentage> ]{1,3} | mixed | standard | CSS Transforms |
| scroll-padding-block-end | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-block-start | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-bottom | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-inline-end | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-inline-start | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-left | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-right | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scroll-padding-top | auto \| <length-percentage> | mixed | standard | CSS Scroll Snap |
| scrollbar-color | auto \| <color>{2} | mixed | standard | CSS Scrollbars Styling |
| shape-outside | none \| [ <shape-box> \|\| <basic-shape> ] \| <image> | mixed | standard | CSS Shapes |
| stroke-dasharray | none \| <dasharray> | mixed | standard | Scalable Vector Graphics |
| stroke-dashoffset | <length-percentage> \| <number> | mixed | standard | Scalable Vector Graphics |
| stroke-width | <length-percentage> \| <number> | mixed | standard | Scalable Vector Graphics |
| tab-size | <integer> \| <length> | mixed | standard | CSS Text |
| text-autospace | normal \| <autospace> \| auto | mixed | standard | CSS Text |
| text-box-edge | auto \| <text-edge> | mixed | standard | CSS Inline |
| text-combine-upright | none \| all \| [ digits <integer>? ] | mixed | standard | CSS Writing Modes |
| text-decoration-inset | <length>{1,2} \| auto | mixed | standard | CSS Text Decoration |
| text-decoration-thickness | auto \| from-font \| <length> \| <percentage> | mixed | standard | CSS Text Decoration |
| text-emphasis-style | none \| [ [ filled \| open ] \|\| [ dot \| circle \| double-circle \| triangle \| sesame ] ] \| <string> | mixed | standard | CSS Text Decoration |
| text-overflow | [ clip \| ellipsis \| <string> ]{1,2} | mixed | standard | CSS Overflow |
| text-shadow | none \| <shadow-t># | mixed | standard | CSS Text Decoration |
| text-underline-offset | auto \| <length> \| <percentage> | mixed | standard | CSS Text Decoration |
| timeline-trigger-exit-range-end | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | standard | CSS Animations |
| timeline-trigger-exit-range-start | [ auto \| normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | standard | CSS Animations |
| timeline-trigger-name | none \| <dashed-ident># | mixed | standard | CSS Animations |
| timeline-trigger-range-end | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | standard | CSS Animations |
| timeline-trigger-range-start | [ normal \| <length-percentage> \| <timeline-range-name> <length-percentage>? ]# | mixed | standard | CSS Animations |
| top | auto \| <length-percentage> \| <anchor()> \| <anchor-size()> | mixed | standard | CSS Anchor Positioning, CSS Positioned Layout |
| transform | none \| <transform-list> | mixed | standard | CSS Transforms |
| transform-origin | [ <length-percentage> \| left \| center \| right \| top \| bottom ] \| [ [ <length-percentage> \| left \| center \| right ] && [ <length-percentage> \| top \| center \| bottom ] ] <length>? | mixed | standard | CSS Transforms |
| transition-property | none \| <single-transition-property># | mixed | standard | CSS Transitions |
| translate | none \| <length-percentage> [ <length-percentage> <length>? ]? | mixed | standard | CSS Transforms |
| trigger-scope | none \| all \| <dashed-ident># | mixed | standard | CSS Animations |
| vertical-align | baseline \| sub \| super \| text-top \| text-bottom \| middle \| top \| bottom \| <percentage> \| <length> | mixed | standard | CSS Inline |
| view-transition-class | none \| <custom-ident>+ | mixed | standard | CSS View Transitions |
| view-transition-name | none \| <custom-ident> \| match-element | mixed | standard | CSS View Transitions |
| width | auto \| <length-percentage [0,∞]> \| min-content \| max-content \| fit-content \| fit-content(<length-percentage [0,∞]>) \| <calc-size()> \| <anchor-size()> | mixed | standard | CSS Box Sizing |
| will-change | auto \| <animateable-feature># | mixed | standard | CSS Will Change |
| word-spacing | normal \| <length> | mixed | standard | CSS Text |
| x | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| y | <length> \| <percentage> | mixed | standard | Scalable Vector Graphics |
| z-index | auto \| <integer> | mixed | standard | CSS Positioned Layout |
| zoom | normal \| reset \| <number [0,∞]> \|\| <percentage [0,∞]> | mixed | standard | CSS Viewport |

## Repeatable syntax

| name | syntax | bucket | status | groups |
| --- | --- | --- | --- | --- |
| border-bottom-left-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| border-bottom-right-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| border-spacing | <length>{1,2} | repeatable | standard | CSS Table |
| border-top-left-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| border-top-right-radius | <length-percentage [0,∞]>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-block-end-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-block-start-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-bottom-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-inline-end-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-inline-start-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-left-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-right-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| corner-shape | <corner-shape-value>{1,4} | repeatable | standard | CSS Backgrounds and Borders |
| corner-top-shape | <corner-shape-value>{1,2} | repeatable | standard | CSS Backgrounds and Borders |
| mask-border-slice | <number-percentage>{1,4} fill? | repeatable | standard | CSS Masking |
| scroll-margin | <length>{1,4} | repeatable | standard | CSS Scroll Snap |
| scroll-margin-block | <length>{1,2} | repeatable | standard | CSS Scroll Snap |
| scroll-margin-inline | <length>{1,2} | repeatable | standard | CSS Scroll Snap |

## Other

_None_