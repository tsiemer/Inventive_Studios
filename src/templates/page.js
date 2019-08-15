import React from 'react'
import { graphql, Link } from 'gatsby'
import { RichText } from 'prismic-reactjs'
import Layout from '../components/layouts' 
import { Blade, Text } from '../components/slices'

// Query for the Page content in Prismic
export const query = graphql`
query PageQuery($uid: String) {
  prismic{
    allPages(uid: $uid){
      edges{
        node{
          _meta{
            id
            uid
            type
          }

          title
          date
        
          body{
            __typename
            ... on PRISMIC_PageBodyBlade{
              type
              label

              primary{
                section_title
                subtitle
                content
                featured_image
                button_color
                button_text
              }
            }
          }
        }
      }
    }
  }
}
`

// Sort and display the different slice options
const PageSlices = ({ slices }) => {
  console.log("Setting up the Slices", slices);


  return slices.map((slice, index) => {
    console.log(slice, index);

    const res = (() => {
      switch(slice.type) {
        case 'text': return (
          <div key={ index } className="homepage-slice-wrapper">
            { <Text slice={ slice } /> }
          </div>
        )

        case 'blade': return (
          console.log(slice),
          <div key={ index } className="homepage-slice-wrapper">
            { <Blade slice={ slice } /> }
          </div>
        )

        default: return null;
      }
    })();
    return res;
  })
}

// Display the title, date, and content of the Post
const PageBody = ({ page }) => {
  console.log("Setting up the page body");

  const titled = page.title.length !== 0 ;
  return (
    <div>
      <div className="container post-header">
        <div className="back">
          <Link to="/">back to list</Link>
        </div>
        {/* Render the edit button */}
        <h1 data-wio-id={ page._meta.id }>
          { titled ? RichText.asText(page.title) : 'Untitled' }
        </h1>
      </div>
      {/* Go through the slices of the post and render the appropiate one */}
      <PageSlices slices={ page.body } />
    </div>
  );
}

export default (props) => {
  console.log("Page Props", props);
  // Define the Post content returned from Prismic
  const doc = props.data.prismic.allPages.edges.slice(0,1).pop();

  if(!doc) return null;

  return(
    <Layout>
      <PageBody page={ doc.node } />
    </Layout>
  )
}
