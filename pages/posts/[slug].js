import styles from '../../styles/Slug.module.css'
import {GraphQLClient,gql} from 'graphql-request';

const graphcms = new GraphQLClient('https://api-us-west-2.hygraph.com/v2/cl95r8dmd6dnf01ukeleo4izk/master');

const QUERY = gql`
query Post($slug: String!){
    post(where: {slug: $slug}){
        title,
        slug,
        coverPhoto{
            url
        }
        content{
            html
        }   
    }    
  

}
`;

const SLUGLIST = gql`
{
    posts{
        slug
    }
}
`;

export async function getStaticPaths(){
    const {posts} = await graphcms.request(SLUGLIST);
    return{
        paths: posts.map((post) => ({params: {slug: post.slug }})),
        fallback: false,
    };
}

export async function getStaticProps({params}){
    const slug = params.slug;
  const data = await graphcms.request(QUERY, {slug});
  const post = data.post;
  return{
    props: {
      post,
    },
  };
}

export default function BlogPost({post}){
    return(
        <main className={styles.blog}>
            <img src={post.coverPhoto.url} className={styles.cover} alt="" />
            <div className={styles.title}>
            </div>
            <h2>{post.title}</h2>
            <div className={styles.content} dangerouslySetInnerHTML={{__html: post.content.html}}></div>
        </main>
    )
}