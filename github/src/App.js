import React from 'react';
import './App.css';
import Search from './components/Search'; 
import UserCard from './components/UserCard';
import RepoCard from './components/RepoCard';
import { withRouter } from 'react-router-dom';
/*import TestComponent from './components/TestComponent';*/


const PAGE_SIZE=10;

class App extends React.Component {
  state ={
    user: null,
    repos:[],
    userDataError: null,
    reposError: null,
    loading:false,
    pageSize: 10, /*Converted to integer from string as infinite scroll uses it for calculations*/ 
    page:1, //Used in load more option
    fetchingRepos:false,
  };
  
  componentDidMount(){
    window.addEventListener('scroll',this.handleScroll/*Event handler*/ );
    const { match } =this.props;

    if(match.params.username) this.fetchData(match.params.username);
  }

  componentWillUnmount(){ /*This is used otherwise ther ewill be a major memory leak*/ 
    window.removeEventListener('scroll',this.handleScroll);
  }

  handleScroll = () => {
    const currentScroll=window.scrollY; /*Gives actual position at which user is at*/
    const maxScroll=document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const{page,pageSize,user}=this.state;

    console.log(currentScroll,maxScroll);

    if(user && maxScroll-currentScroll<=100 &&  (page-1)*pageSize<user.public_repos) this.loadPage();
  };

  fetchUserData = async (username) =>{
    const res = await fetch(`https://api.github.com/users/${username}`); // await as async function and this call is by default get
    if(res.ok){
      const data= await res.json();  //this is also await because res is awaited
          
      return this.setState({
          user:data,
          loading:false
       });
    }
        
    const error=(await res.json()).message; //if username is not present or if anyother errror
    return {error};
  };

  fetchRepos = async(username) => {
    //const {page}=this.state;  refers to the page no of repo to be fetched, Used in load more function
    const {pageSize,page} = this.state;
    const  res = await fetch(`https://api.github.com/users/${username}/repos?page=${page}&per_page=${pageSize}`);
    if(res.ok){
      const data= await res.json();  //this is also await because res is awaited
          
      return {data};
    }
        
    const error=(await res.json()).message; 
    return {error};
  };

  fetchData= async username => {  //Async as promise is fetched 
    //fetch github api
    this.setState({loading:true},async ()=>{ //All the logic to fetch user is in a callback function which is executed only when loading is set to true to ensure syncrous compilation by react
      try{  //async function must always be inside try and catch blocks
        const[user,repos]=await Promise.all(   //Promise, this will return only when both fetching will pass or if anyone of them fail. Also it will return an array 
          [
            this.fetchUserData(username),
            this.fetchRepos(username)  
          ]
        );

        if(user.data !==undefined  &&  repos.data !==undefined){
          return this.setState({
            user:user.data,
            repos:repos.data,
            //page:repos.page,
            page:2,//infinite Scroll
            loading:false});
        }

        this.setState({
          userDataError: user.error,
          reposError:repos.error,
          loading:false
        });
      }catch(err){
        this.setState({
          error: "There was some error",
          loading:false
        });
      }
    });  
  };

  /*loadMore = async () => {
    const { data,page } = await this.fetchRepos(this.state.user.login);
    if(data){
      this.setState(state=>({  //state is passed to this so at the time of updating the final and fresh state is fetched of repos and updated or appened with the new data fetched
        page:page,
        repos:[...state.repos, ...data],
      }));
    }
  };*/

  loadPage = async () => {
    if(this.state.fetchingRepos === true) return;

    this.setState({fetchingRepos:true}, async () =>{
      const { data } = await this.fetchRepos(this.state.user.login);
      if(data){
       this.setState(state=>({  //state is passed to this so at the time of updating the final and fresh state is fetched of repos and updated or appened with the new data fetched
          repos:[...state.repos,...data],
          page:state.page+1,
          fetchingRepos:false,
        }));
      }
    });
  };

  /* Pagination Component-> handlePageChange = (page) => {   //This function updates the page size before calling load page function when we cahnge the page no from button
    this.setState({page},()=>this.loadPage());
  };

  handlePageSizeChange = (e) => this.setState({
    pageSize:e.target.value,
  },()=>this.loadPage());
  */
  render(){ //the loading and error lines are actually like if statements that execute only when they are true or have some value
    const {userDataError, reposError, loading, user, repos,/*pageSize ->Requied during pagination*/} =this.state;
    const {match}=this.props;
    const   renderRepos = !loading && !reposError && !!repos.length;

    return (
      <>    
      <div>
      <Search username={match.params.username}/>
      <div className='container'>
        <div className='text-center pt-5'>
        {loading && <p>Loading...</p>}
        {userDataError && <p className='text-danger'>{userDataError}</p>}
        </div>
        {!loading && !userDataError && user && <UserCard user={user}/>}
        {reposError && <p className='text-danger'>{reposError}</p>}
        
        {/*pageSize === '30' && <TestComponent pageSize={pageSize}/>*/}

        {renderRepos && (
        <React.Fragment>
          {/*Pages button-><div className="mb-4">
            {[...new Array(Math.ceil(user.public_repos / pageSize))].map((_, index)=>(<button key={index+1} className="btn btn-success mr-2" onClick={()=> this.handlePageChange(index)}>{index+1}</button>),)}
          </div>

          Selecting page size-><div className='d-inline-block mb-4'>
            <select className='form-control' value={pageSize} onChange={this.handlePageSizeChange}>
              <option value="10">10</option>
              <option value="20">20</option>
              <option value="30">30</option>
            </select>  
          </div>*/}

            {repos.map(repo => <RepoCard key={repo.id} repo={repo}/>)}
            {/*!loading && !userDataError && user && (page-1)*PAGE_SIZE<user.public_repos && (<button className="btn btn-success" onClick={this.loadMore}>Load More</button>) -Load More Button Functon*/} 
        </React.Fragment>)}
      </div>
      </div>
      </>
    );
  }
}

export default withRouter(App);
