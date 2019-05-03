const pageHeader = (mainText, subText, rightComponent) => {    
     return (        
        <div style={{display: 'flex', justifyContent:'space-between', marginBottom: '30px' }}>
            <div>
                <h1 style={{width: '300px', fontSize:'25px'}}><strong>{mainText}</strong></h1>            
                {(subText) ? <p style={{marginTop: '8px', width: '300px', fontSize:'17px'}}>{subText}</p> : null}
            </div>
            {(rightComponent) ? rightComponent : null}
        </div>                    
    )
}

export default pageHeader