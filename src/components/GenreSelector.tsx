const GenreSelector = ( {genres, index} : {genres: Array<string>, index: number}) => {
  return ( 
		<select id={`seed` + index} className='bg-[#262626] p-2 text-center text-md rounded-2xl select-none border-none focus:ring-primary-500 focus:ring-2 w-full'>
			{genres.map((item, index) => <option value={item} key={index}>{capitalize(item)}</option>)}
		</select>
  )
}

function capitalize(str: string) {
	return str.charAt(0).toUpperCase() + str.slice(1);
}

export default GenreSelector;